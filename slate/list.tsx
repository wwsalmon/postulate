import {ReactEditor, Slate} from "slate-react";
import {HistoryEditor} from "slate-history";
import {Editor, Element, Node, Path, Point, Text, Transforms} from "slate";
import insertEmptyLine from "./insertEmptyLine";
import {KeyboardEvent} from "react";
import {isNodeEmpty} from "./withDeserializeMD";

export const onShortcutSpaceList = (editor: ReactEditor & HistoryEditor, type: string, isNumbered: boolean) => {
    const isList = type === "li";

    if (isList) {
        const parentList = Editor.above(editor, {
            match: n => isListNode(Editor.isBlock(editor, n) && n.type),
        });

        if (parentList) return;

        indentListItem(editor, isNumbered);
    }
}

export const onDeleteBackwardsList = (editor: ReactEditor & HistoryEditor, type: string) => {
    const isList = type === "li";

    if (!isList) return false;

    const thisPath = editor.selection.anchor.path;
    const thisIndex = thisPath[thisPath.length - 2];

    // if first item in list, unwrap and handle normally; else merge with item above
    if (thisIndex === 0) {
        const thisLevels = Editor.levels(editor, {match: n => Element.isElement(n) && isListNode(n.type), reverse: true});
        thisLevels.next();
        const level2 = thisLevels.next();
        const level2IsList = level2.value && level2.value.length && Element.isElement(level2.value[0]) && isListNode(level2.value[0].type);

        // attempt to un-indent the item
        unIndentListItem(editor);

        // if not nested item, unwrap the item
        if (!level2IsList) {
            Transforms.unwrapNodes(editor, {match: n => Element.isElement(n) && isListNode(n.type), split: true});
        }

        return level2IsList;
    } else {
        const thisNodePath = thisPath.slice(0, thisPath.length - 1);
        const thisLeaf = Editor.leaf(editor, thisPath);

        // if empty list item in middle of list delete the block
        if (thisLeaf[0].text === "") {
            Transforms.removeNodes(editor, {at: thisNodePath});
            return true;
        }

        const prevNode = thisIndex === 0 ? null : Editor.node(editor, [...thisPath.slice(0, thisPath.length - 2), thisIndex - 1]);
        const isPrevList = prevNode && Element.isElement(prevNode[0]) && isListNode(prevNode[0].type);

        // if prevNode is list, merge with it; otherwise just return false
        if (isPrevList && Element.isElement(prevNode[0])) {
            const toPath = [...thisPath.slice(0, thisPath.length - 2), thisIndex - 1, prevNode[0].children.length];

            Transforms.moveNodes(editor, {at: thisNodePath, to: toPath});
        } else {
            Transforms.mergeNodes(editor, {at: thisNodePath});
        }

        return true;
    }
}

export const onEnterList = (editor: ReactEditor & HistoryEditor) => {
    const listType = getListItemType(editor);
    if (listType === false) return false;
    const isNumbered = listType.isNumbered;

    const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path);

    const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
    });

    if (Text.isText(selectedLeaf) && selectedLeaf.text.length === editor.selection.anchor.offset) {
        // if empty li
        
        if (block[0].children && block[0].children.length && Text.isText(block[0].children[0]) && block[0].children[0].text === "") {
            Transforms.unwrapNodes(editor, {
                match: n => Element.isElement(n) && n.type === (isNumbered ? "ol" : "ul"),
                split: true,
            });

            const thisLevels = Editor.levels(editor, {match: n => Element.isElement(n) && isListNode(n.type), reverse: true});
            const level1 = thisLevels.next();

            // if parent after unwrapping is not list, turn the node into a p, otherwise keep it a list item
            if (!(level1.value && level1.value.length && Element.isElement(level1.value[0]) && isListNode(level1.value[0].type))) {
                Transforms.setNodes(editor, {type: "p"});
            }

            return true;
        }

        insertEmptyLine(editor, "li");
    } else {
        // if at start of block
        if (Point.equals(editor.selection.anchor, Editor.start(editor, block[1]))) {
            insertEmptyLine(editor, "li", block[1]);
        } else {
            Transforms.splitNodes(editor);
        }
    }

    return true;
}

export const onTabList = (e: KeyboardEvent<HTMLDivElement>, editor: ReactEditor & HistoryEditor) => {
    if (e.key !== "Tab") return false;

    e.preventDefault();

    if (e.shiftKey) {
        return unIndentListItem(editor);
    } else {
        return indentListItem(editor);
    }
}

export const isListNode = (type: string) => ["ul", "ol"].includes(type);

const indentListItem = (editor: ReactEditor & HistoryEditor, isNumberedInit?: boolean) => {
    let isNumbered;
    if (isNumberedInit !== undefined) {
        isNumbered = isNumberedInit;
    } else {
        const listType = getListItemType(editor);
        if (listType === false) return false;
        isNumbered = listType.isNumbered;
    }

    const thisPath = editor.selection.anchor.path;
    const thisIndex = thisPath[thisPath.length - 2];

    if (thisIndex === 0 && isNumberedInit === undefined) return true;

    const list = {
        type: (isNumbered ? "ol" : "ul"),
        children: [],
    };

    Transforms.wrapNodes(editor, list, {
        match: n => Element.isElement(n) && n.type === "li",
    });

    return true;
}

const unIndentListItem = (editor: ReactEditor & HistoryEditor, at?: Path) => {
    const listType = getListItemType(editor);
    if (listType === false) return false;
    const isNumbered = listType.isNumbered;

    let levelsOptions = {match: n => isListNode(n.type), reverse: true};
    if (at) levelsOptions["at"] = at;

    const thisLevels = Editor.levels(editor, levelsOptions);
    thisLevels.next();
    const level2 = thisLevels.next();

    const isLevel2List = level2.value && level2.value.length && Element.isElement(level2.value[0]) && isListNode(level2.value[0].type);

    // if no ul two levels up then you can't unwrap
    if (!isLevel2List) {
        return false;
    }

    let unwrapOptions = {
        match: n => n.type === (isNumbered ? "ol" : "ul"),
        split: true,
    }
    if (at) unwrapOptions["at"] = at;

    Transforms.unwrapNodes(editor, unwrapOptions);

    // un-indent following list if it exists
    const thisPath = at ? at : editor.selection.anchor.path;
    const thisIndex = thisPath[thisPath.length - 2];
    const parentNode = Editor.node(editor, thisPath.slice(0, thisPath.length - 2));
    const nextNode = Element.isElement(parentNode[0]) && (parentNode[0].children.length > thisIndex + 1) && Editor.node(editor, [...thisPath.slice(0, thisPath.length - 2), thisIndex + 1]);
    const isNextListStartsWithList = nextNode && Element.isElement(nextNode[0]) && isListNode(nextNode[0].type) && nextNode[0].children.length && Element.isElement(nextNode[0].children[0]) && isListNode(nextNode[0].children[0].type);

    if (isNextListStartsWithList) {
        Transforms.moveNodes(editor, {at: [...nextNode[1], 0], to: [...thisPath.slice(0, thisPath.length - 2), thisIndex + 1]});
    }

    return true;
}

export const withLists = (editor: ReactEditor & HistoryEditor) => {
    const {normalizeNode} = editor;

    editor.normalizeNode = (entry) => {
        const [thisNode, thisPath] = entry;

        // console.log("normalizing", thisPath, thisNode);

        // remove empty lists
        if (Element.isElement(thisNode) && isListNode(thisNode.type) && thisNode.children.every(d => (Element.isElement(d) ? d.type !== "li" : Text.isText(d) && d.text === "") && isNodeEmpty(d))) {
            // console.log("found empty list");
            if (JSON.stringify(thisPath) === "[0]") {
                return Transforms.setNodes(editor, {type: "p"}, {at: thisPath})
            } else {
                return Transforms.removeNodes(editor, {at: thisPath});
            }
        }

        // unwrap block
        if (Element.isElement(thisNode) && thisNode.type === "li") {
            // console.log("considering list item", thisPath);

            for (let childIndex in thisNode.children) {
                if (thisNode.children[childIndex]) {
                    const thisChild = thisNode.children[childIndex];

                    // if list under list item, unwrap list
                    if (Element.isElement(thisChild) && isListNode(thisChild.type)) {
                        Transforms.unwrapNodes(editor, {
                            at: [...thisPath, +childIndex],
                            match: (node, path) => Element.isElement(node) && node.type === "li" && JSON.stringify(path) === JSON.stringify(thisPath),
                            split: true
                        });
                        return;
                    }

                    // if non-inline child that is not a sublist, then unwrap
                    if (Element.isElement(thisChild) && !editor.isInline(thisChild) && !isListNode(thisChild.type)) {
                        // console.log("unwrapping child", thisChild);

                        Transforms.unwrapNodes(editor, {at: [...thisPath, +childIndex, 0], match: (node, path) => {
                                const isMatch = Element.isElement(node) && node.type === thisChild.type && JSON.stringify(path) === JSON.stringify([...thisPath, +childIndex]);
                                // console.log(isMatch, node, path);
                                return isMatch;
                            }});
                        return;
                    }
                }
            }
        }

        // console.log("normalizing", thisPath, thisNode);

        // if element has children that are lists
        if (Element.isElement(thisNode) && thisNode.children.length && thisNode.children.some(d => Element.isElement(d) && isListNode(d.type))) {
            // console.log("has children lists");

            for (let childIndex in thisNode.children) {
                const thisChild = thisNode.children[childIndex];

                // console.log("is child list", childIndex);

                if (Element.isElement(thisChild) && isListNode(thisChild.type)) {
                    if ((+childIndex + 1) < thisNode.children.length) {
                        const nextChild = thisNode.children[+childIndex + 1];
                        const isThisNumbered = thisChild.type === "ol";
                        const isNextNumbered = Element.isElement(nextChild) && nextChild.type === "ol";
                        
                        if (Element.isElement(nextChild) && isListNode(nextChild.type) && (isThisNumbered === isNextNumbered)) {
                            // console.log("merging down");

                            Editor.withoutNormalizing(editor, () => {
                                const nextPath = [...thisPath, +childIndex + 1];
                                const toPath = [...thisPath, +childIndex, thisChild.children.length];

                                Transforms.moveNodes(editor, {at: nextPath,
                                    match: (
                                        node,
                                        path
                                    ) => {
                                        const isMatch = JSON.stringify(path.slice(0, path.length - 1)) === JSON.stringify(nextPath);
                                        console.log(isMatch, path, nextPath);
                                        return isMatch;
                                    },
                                    to: toPath
                                });

                                Transforms.removeNodes(editor, {at: nextPath});

                                const entryToNormalize = Editor.node(editor, thisPath);

                                editor.normalizeNode(entryToNormalize);
                            });

                            return;
                        }
                    }

                    // first item in list can't be list
                    if (+childIndex === 0) {
                        // console.log("unindenting");

                        unIndentListItem(editor, [...thisPath, +childIndex, 0]);

                        return;
                    }
                }
            }
        }

        normalizeNode(entry);
    }

    return editor;
}

const getListItemType = (editor: ReactEditor & HistoryEditor) => {
    const parentList = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n) && isListNode(n.type),
    });

    if (!(parentList && Element.isElement(parentList[0]))) return false;

    const isNumbered = parentList[0].type === "ol";

    return {isNumbered};
}