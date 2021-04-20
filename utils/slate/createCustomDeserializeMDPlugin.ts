import { setNodes } from '@udecode/slate-plugins-common';
import {
    getSlatePluginWithOverrides,
    SPEditor,
    TElement,
    WithOverride,
} from '@udecode/slate-plugins-core';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {deserializeMD} from "@udecode/slate-plugins-md-serializer";
import {ELEMENT_CODE_BLOCK, getSlatePluginType, someNode} from "@udecode/slate-plugins";

/**
 * Enables support for deserializing content
 * from Markdown format to Slate format.
 */
export const withDeserializeMD = (): WithOverride<ReactEditor & SPEditor> => (
    editor
) => {
    const { insertData } = editor;

    editor.insertData = (data) => {
        const type = getSlatePluginType(editor, ELEMENT_CODE_BLOCK);
        const isCodeBlock = someNode(editor, { match: { type } });
        const content = data.getData('text/plain');

        if (isCodeBlock) {
            insertData(data);
            return;
        }

        if (content) {
            const fragment = deserializeMD(editor, content);

            if (!fragment.length) return;

            if (fragment[0].type) {
                setNodes<TElement>(editor, { type: fragment[0].type });
            }

            Transforms.insertFragment(editor, fragment);
            return;
        }

        insertData(data);
    };

    return editor;
};

/**
 * @see {@link withDeserializeMd}
 */
export const createCustomDeserializeMDPlugin = getSlatePluginWithOverrides(
    withDeserializeMD
);
