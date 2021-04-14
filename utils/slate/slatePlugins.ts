import {
    AutoformatRule,
    createAutoformatPlugin,
    createBasicElementPlugins,
    createBasicMarkPlugins,
    createDeserializeHTMLPlugin,
    createDeserializeMDPlugin,
    createExitBreakPlugin,
    createHistoryPlugin,
    createLinkPlugin,
    createListPlugin,
    createNodeIdPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSlatePluginsOptions,
    createSoftBreakPlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LI,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TD,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    ExitBreakPluginOptions, getRenderElement,
    getSlatePluginType,
    insertCodeBlock, insertNodes,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    KEYS_HEADING,
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    ResetBlockTypePluginOptions,
    SoftBreakPluginOptions,
    someNode,
    SPEditor,
    toggleList,
    unwrapList,
    unwrapNodes,
    upsertLinkAtSelection,
    WithAutoformatOptions
} from "@udecode/slate-plugins";
import isHotkey from "is-hotkey";
import normalizeUrl from "normalize-url";
import {createCustomImagePlugin} from "./createCustomImagePlugin";
import axios from "axios";

export const options = createSlatePluginsOptions();

const preFormat: AutoformatRule['preFormat'] = (editor) =>
    unwrapList(editor as SPEditor);

const optionsAutoformat: WithAutoformatOptions = {
    rules: [
        {
            type: options[ELEMENT_H2].type,
            markup: '#',
            preFormat,
        },
        {
            type: options[ELEMENT_H3].type,
            markup: '##',
            preFormat,
        },
        {
            type: options[ELEMENT_H4].type,
            markup: '###',
            preFormat,
        },
        {
            type: options[ELEMENT_H5].type,
            markup: '####',
            preFormat,
        },
        {
            type: options[ELEMENT_H6].type,
            markup: '#####',
            preFormat,
        },
        {
            type: options[ELEMENT_LI].type,
            markup: ['*', '-'],
            preFormat,
            format: (editor) => {
                toggleList(editor as SPEditor, { type: options[ELEMENT_UL].type });
            },
        },
        {
            type: options[ELEMENT_LI].type,
            markup: ['1.', '1)'],
            preFormat,
            format: (editor) => {
                toggleList(editor as SPEditor, { type: options[ELEMENT_OL].type });
            },
        },
        {
            type: options[ELEMENT_TODO_LI].type,
            markup: ['[]'],
        },
        {
            type: options[ELEMENT_BLOCKQUOTE].type,
            markup: ['>'],
            preFormat,
        },
        {
            type: options[MARK_BOLD].type,
            between: ['**', '**'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[MARK_BOLD].type,
            between: ['__', '__'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[MARK_ITALIC].type,
            between: ['*', '*'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[MARK_ITALIC].type,
            between: ['_', '_'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[MARK_CODE].type,
            between: ['`', '`'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[MARK_STRIKETHROUGH].type,
            between: ['~~', '~~'],
            mode: 'inline',
            insertTrigger: true,
        },
        {
            type: options[ELEMENT_CODE_BLOCK].type,
            markup: '``',
            trigger: '`',
            triggerAtBlockStart: false,
            preFormat,
            format: (editor) => {
                insertCodeBlock(editor as SPEditor, { select: true });
            },
        },
    ],
};

const resetBlockTypesCommonRule = {
    types: [options[ELEMENT_BLOCKQUOTE].type, options[ELEMENT_TODO_LI].type],
    defaultType: options[ELEMENT_PARAGRAPH].type,
};

const optionsResetBlockTypePlugin: ResetBlockTypePluginOptions = {
    rules: [
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
        },
        {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
        },
    ],
};

const optionsSoftBreakPlugin: SoftBreakPluginOptions = {
    rules: [
        { hotkey: 'shift+enter' },
        {
            hotkey: 'enter',
            query: {
                allow: [
                    options[ELEMENT_CODE_BLOCK].type,
                    options[ELEMENT_BLOCKQUOTE].type,
                    options[ELEMENT_TD].type,
                ],
            },
        },
    ],
};

const optionsExitBreakPlugin: ExitBreakPluginOptions = {
    rules: [
        {
            hotkey: 'mod+enter',
        },
        {
            hotkey: 'mod+shift+enter',
            before: true,
        },
        {
            hotkey: 'enter',
            query: {
                start: true,
                end: true,
                allow: KEYS_HEADING,
            },
        },
    ],
};

export const pluginsFactory = () => {
    const plugins = [
        createReactPlugin(),
        createHistoryPlugin(),
        ...createBasicElementPlugins(),
        ...createBasicMarkPlugins(),
        createAutoformatPlugin(optionsAutoformat),
        createResetNodePlugin(optionsResetBlockTypePlugin),
        createSoftBreakPlugin(optionsSoftBreakPlugin),
        createExitBreakPlugin(optionsExitBreakPlugin),
        createDeserializeMDPlugin(),
        createCustomImagePlugin({
            uploadImage: async file => {
                try {
                    const form = new FormData();
                    form.append("image", file);
                    const res = await axios.post(`/api/upload?projectId=60495b802beda615482755d6&attachedType=post&attachedUrlName=neweditor`, form);
                    console.log(res);
                    return res.data.data.filePath;
                } catch (e) {
                    console.log(e);
                }
            },
        }),
        createNodeIdPlugin(),
        createListPlugin(),
        createLinkPlugin(),
        {
            onKeyDown: editor => e => {
                if (isHotkey("mod+k", e)) {
                    e.preventDefault();

                    const type = getSlatePluginType(editor, ELEMENT_LINK);
                    const isLink = someNode(editor, { match: { type } });

                    // if there is a link at the cursor, get rid of the link
                    if (isLink) unwrapNodes(editor, {at: editor.selection, match: {type: getSlatePluginType(editor, ELEMENT_LINK)}});
                    // else if there is a selection, not just a point, create a link on that selection
                    else if (editor.selection.anchor !== editor.selection.focus) {
                        // taken from ToolbarLink.tsx with modifications
                        const url = normalizeUrl(window.prompt(`Enter the URL of the link:`));
                        if (url) {
                            upsertLinkAtSelection(editor, { url, wrap: true });
                        }
                    }
                }
            }
        },
        {
            pluginKeys: "loading",
            renderElement: getRenderElement("loading"),
            voidTypes: () => ["div"],
        }
    ];

    plugins.push(createDeserializeHTMLPlugin({ plugins }));

    return plugins;
};