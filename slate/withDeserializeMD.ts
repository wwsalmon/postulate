import {CustomEditor} from "./slate-types";
import {Descendant, Editor, Element, Node, Text, Transforms} from "slate";
import {unified} from "unified";
import markdown from "remark-parse";
import math from "remark-math";
import slate from "remark-slate";

const withDeserializeMD = (editor: CustomEditor) => {
    const {insertData} = editor;

    editor.insertData = (data) => {
        const block = Editor.above(editor, {match: n => Element.isElement(n), mode: "lowest"});
        const noDeserialize = block && Element.isElement(block[0]) && ["codeblock", "inlineTex", "blockTex"].includes(block[0].type);
        if (noDeserialize) return insertData(data);

        const content = data.getData("text/plain");
        if (content) {
            const fragment = unified()
                .use(markdown)
                .use(math)
                .use(slate, {
                    nodeTypes: {
                        paragraph: "p",
                        block_quote: "blockquote",
                        link: "a",
                        image: "img",
                        code_block: "codeblock",
                        ul_list: "ul",
                        ol_list: "ol",
                        listItem: "li",
                        heading: {
                            1: "h1",
                            2: "h2",
                            3: "h3",
                            4: "h4",
                            5: "h5",
                            6: "h6",
                        },
                    },
                    linkDestinationKey: "href",
                })
                .processSync(content)
                .result as Descendant[];

            if (fragment.length) insertNodesAndClearEmpty(editor, fragment);
        }

        insertData(data);
    };

    return editor;
};

export const isNodeEmpty = (node: Node) => {
    if (Text.isText(node)) return !node.text;
    if (Element.isElement(node)) return node.children.every(child => isNodeEmpty(child));
    else return true;
}

export const insertNodesAndClearEmpty = (editor: CustomEditor, nodes: Node | Node[]) => {
    const block = Editor.above(editor, {match: n => Element.isElement(n), mode: "lowest"});

    Transforms.insertNodes(editor, nodes);

    if (isNodeEmpty(block[0])) {
        Transforms.removeNodes(editor, {at: block[1]});
    }
}

export default withDeserializeMD;