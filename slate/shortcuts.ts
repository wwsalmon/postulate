import {Editor, Element, Element as SlateElement, Node, Point, Range, Transforms} from "slate";
import {onDeleteBackwardsList, onShortcutSpaceList} from "./list";

export type BulletedListElement = {
    type: "ul",
    children: Node[],
}

export type NumberedListElement = {
    type: "ol",
    children: Node[],
}

const mdShortcuts = {
    "*": "li",
    "-": "li",
    "+": "li",
    ">": "blockquote",
    "#": "h1",
    "##": "h2",
    "###": "h3",
    "####": "h4",
    "#####": "heading-five",
    "######": "heading-six",
    "1.": "li", // but this is special case
    "```": "codeblock",
    "$$": "blockTex",
};

export const withShortcuts = editor => {
    const {deleteBackward, insertText} = editor;

    editor.insertText = text => {
        const {selection} = editor;

        // if inserting space and cursor is collapsed
        if (text === " " && selection && Range.isCollapsed(selection)) {
            const {anchor} = selection;
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = {anchor, focus: start};
            const beforeText = Editor.string(editor, range);
            const type = mdShortcuts[beforeText];
            const isNumbered = beforeText === "1.";

            if (type) {
                Transforms.select(editor, range);
                Transforms.delete(editor);

                Transforms.setNodes(editor, {type}, {
                    match: n => Editor.isBlock(editor, n),
                });

                onShortcutSpaceList(editor, type, isNumbered);

                return;
            }
        }

        insertText(text);
    };

    editor.deleteBackward = (...args) => {
        const {selection} = editor;

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });

            if (match) {
                const [block, path] = match;
                const start = Editor.start(editor, path);

                if (
                    Element.isElement(block) &&
                    block.type !== "p" &&
                    Point.equals(selection.anchor, start)
                ) {
                    
                    if (onDeleteBackwardsList(editor, block.type)) return;

                    const newProperties: Partial<SlateElement> = {type: "p"};
                    Transforms.setNodes(editor, newProperties);

                    return;
                }
            }
        }

        deleteBackward(...args);
    };

    return editor;
};