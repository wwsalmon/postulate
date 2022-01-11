import {isBlockActive} from "./hotkeys";

export const withCodeblocks = editor => {
    const {insertData, insertText} = editor;

    editor.insertData = data => {
        const text = data.getData("text/plain");

        const isCodeBlock = isBlockActive(editor, "codeblock");

        if (isCodeBlock) {
            insertText(text);
        } else {
            insertData(data);
        }
    };

    return editor;
};