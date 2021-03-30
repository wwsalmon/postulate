import {SlatePlugins} from '@udecode/slate-plugins';

export default function SlateDemo() {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <h3 className="up-ui-title">Slate</h3>
            <div className="prose content">
                <SlatePlugins
                    initialValue={[
                        {
                            type: 'paragraph',
                            children: [{ text: 'A line of text in a paragraph.' }],
                        },
                    ]}
                />
            </div>
        </div>
    );
}