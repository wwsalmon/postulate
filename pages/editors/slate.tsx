import {
    AutoformatRule,
    createAutoformatPlugin,
    createBasicElementPlugins,
    createBasicMarkPlugins,
    createExitBreakPlugin, createHistoryPlugin,
    createReactPlugin,
    createResetNodePlugin,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    createSoftBreakPlugin,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TD,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    ExitBreakPluginOptions,
    insertCodeBlock,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
    KEYS_HEADING,
    MARK_BOLD,
    MARK_CODE,
    MARK_ITALIC,
    MARK_STRIKETHROUGH,
    MARK_UNDERLINE,
    ResetBlockTypePluginOptions,
    SlatePlugins,
    SoftBreakPluginOptions,
    SPEditor,
    toggleList,
    unwrapList,
    WithAutoformatOptions,
} from '@udecode/slate-plugins';

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

const preFormat: AutoformatRule['preFormat'] = (editor) =>
    unwrapList(editor as SPEditor);

const optionsAutoformat: WithAutoformatOptions = {
    rules: [
        {
            type: options[ELEMENT_H1].type,
            markup: '#',
            preFormat,
        },
        {
            type: options[ELEMENT_H2].type,
            markup: '##',
            preFormat,
        },
        {
            type: options[ELEMENT_H3].type,
            markup: '###',
            preFormat,
        },
        {
            type: options[ELEMENT_H4].type,
            markup: '####',
            preFormat,
        },
        {
            type: options[ELEMENT_H5].type,
            markup: '#####',
            preFormat,
        },
        {
            type: options[ELEMENT_H6].type,
            markup: '######',
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

const plugins = [
    createReactPlugin(),
    createHistoryPlugin(),
    ...createBasicElementPlugins(),
    ...createBasicMarkPlugins(),
    createAutoformatPlugin(optionsAutoformat),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
];

export default function SlateDemo() {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <h3 className="up-ui-title">Slate</h3>
            <div className="prose content">
                <SlatePlugins
                    initialValue={[
                        {
                            type: 'paragraph',
                            children: [{
                                text: 'A line of text in a paragraph.',
                                [options[MARK_BOLD].type]: true,
                                [options[MARK_ITALIC].type]: true,
                                [options[MARK_UNDERLINE].type]: true,
                            }],
                        },
                    ]}
                    plugins={plugins}
                    components={components}
                    options={options}
                />
            </div>
        </div>
    );
}