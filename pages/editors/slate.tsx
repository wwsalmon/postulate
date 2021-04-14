import {SlatePlugins,} from '@udecode/slate-plugins';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useMemo, useState} from "react";
import markdown from "remark-parse";
import slate from "remark-slate";
import unified from "unified";
import draggableComponents from "../../utils/slate/slateDraggables";
import {options, pluginsFactory} from "../../utils/slate/slatePlugins";
import SlateBalloon from "../../components/SlateBalloon";

const markdownString = `
# Heading one

## Heading two

### Heading three

#### Heading four

##### Heading five

###### Heading six

Normal paragraph

_italic text_

**bold text**

~~strike through text~~

[hyperlink](https://jackhanford.com)

![image](https://jackhanford.com/test.png)

> A block quote.

- bullet list item 1
- bullet list item 2

1. ordered list item 1
2. ordered list item 2
`;

console.log(unified().use(markdown).use(slate).processSync(markdownString).result);

export default function SlateDemo() {
    const [body, setBody] = useState<any[]>([{"type": "p", "id": 1618006912384, "children": [{"text": "A line of text in a paragraph. yuh"}]}, {
        "type": "p",
        "id": 1618006935286,
        "children": [{"text": "this "}]
    }, {"type": "p", "children": [{"text": "ba"}], "id": 1618006944869}, {
        "type": "p",
        "children": [{"text": "there's literally no difference"}],
        "id": 1618006951028
    }]);

    const pluginsMemo = useMemo(pluginsFactory, []);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h3 className="up-ui-title">Slate</h3>
            <div className="prose content">
                <DndProvider backend={HTML5Backend}>
                    <SlatePlugins
                        id="testId"
                        value={body}
                        onChange={newValue => setBody(newValue)}
                        plugins={pluginsMemo}
                        components={draggableComponents}
                        options={options}
                    >
                        <SlateBalloon/>
                    </SlatePlugins>
                </DndProvider>
            </div>
        </div>
    );
}