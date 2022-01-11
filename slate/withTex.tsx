import {CustomEditor} from "./slate-types";
import {Editor, Element, Node, Point, Range, Transforms} from "slate";

const withTex = (editor: CustomEditor) => {
    const {insertText, isInline, normalizeNode, deleteBackward} = editor;

    editor.deleteBackward = (unit) => {
        const block = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
        });

        if (Element.isElement(block[0]) && block[0].type !== "inlineTex") {
            const thisLeaf = Editor.leaf(editor, editor.selection.anchor.path);
            const thisText = thisLeaf[0].text;

            if (thisText === "  ") {
                Transforms.removeNodes(editor, {at: thisLeaf[1].slice(0, thisLeaf[1].length - 1)});
                return;
            }
        }

        deleteBackward(unit);
    }

    editor.isInline = (element) => {
        return element.type === "inlineTex" || isInline(element);
    }

    editor.insertText = (text) => {
        const {selection} = editor;
        const {anchor} = selection;
        const {path, offset} = anchor;

        if (offset > 0 && text === " " && selection && Range.isCollapsed(selection)) {
            const beforeText = Editor.string(editor, {anchor, focus: {path: path, offset: offset - 1}});
            const twoBeforeText = offset > 1 ? Editor.string(editor, {
                anchor: {path: path, offset: offset - 1},
                focus: {path: path, offset: offset - 2}
            }) : null;

            if (beforeText === "$" && twoBeforeText !== "$") {
                const block = Editor.above(editor, {
                    match: n => Editor.isBlock(editor, n),
                });

                if (Element.isElement(block[0]) && block[0].type !== "inlineTex") {
                    Transforms.select(editor, {anchor, focus: {path: path, offset: offset - 1}});
                    Transforms.delete(editor);
                    Transforms.insertNodes(editor, [{type: "inlineTex", children: [{text: "  "}]}]);
                    const thisPoint = {path: editor.selection.anchor.path, offset: 1};
                    Transforms.select(editor, {anchor: thisPoint, focus: thisPoint});

                    return;
                }
            }
        }

        insertText(text);
    }

    editor.normalizeNode = (entry) => {
        if (Element.isElement(entry[0]) && entry[0].type === "inlineTex") {
            const thisLeaf = Editor.leaf(editor, editor.selection.anchor.path);
            const thisText = thisLeaf[0].text;

            if (thisText.charAt(0) !== " ") {
                Transforms.insertText(editor, " ", {at: {path: thisLeaf[1], offset: 0}});
                const thisPoint = {path: thisLeaf[1], offset: 1};
                Transforms.select(editor, thisPoint);
                return;
            }

            if (thisText.charAt(Math.max(thisText.length - 1, 1)) !== " ") {
                Transforms.insertText(editor, " ", {at: {path: thisLeaf[1], offset: thisText.length}});
                const thisPoint = {path: thisLeaf[1], offset: thisText.length};
                Transforms.select(editor, thisPoint);
                return;
            }
        }

        normalizeNode(entry);
    }

    return editor;
};

export default withTex;