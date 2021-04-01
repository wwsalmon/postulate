import {
    createBasicElementPlugins,
    createBoldPlugin,
    createCodePlugin,
    createItalicPlugin,
    createKbdPlugin,
    createReactPlugin,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    SlatePlugins,
} from '@udecode/slate-plugins';

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

const plugins = [
    createReactPlugin(),
    ...createBasicElementPlugins(),
    createBoldPlugin(),
    createItalicPlugin(),
    createCodePlugin(),
    createStrikethroughPlugin(),
    createSuperscriptPlugin(),
    createSubscriptPlugin(),
    createKbdPlugin(),
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