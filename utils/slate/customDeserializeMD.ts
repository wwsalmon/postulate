const t = 0;
export default t;
/* commented out bc references out-of-repo version of remark-slate, once my PRs are merged (for images and inline code) the published version should work fine
// use dist/customDeserializerMD.js, the compiled version of this file
import unified from "unified";
import markdown from "remark-parse";
import slate from "../../../remark-slate";

function addIds(children: any[], lastId: number): number {
    let currId = lastId;
    for (let node of children) {
        if (node.children) {
            currId++;
            node.id = currId;
            currId = addIds(node.children, currId);
        }
    }
    return currId;
}

export default function customDeserializeMD(markdownString: string) {
    // @ts-ignore
    let parsed: any[] = unified()
        .use(markdown)
        .use(slate, {
            nodeTypes: {
                paragraph: "p",
                block_quote: "blockquote",
                link: "a",
                image: "img",
                code_block: "code_block",
                ul_list: "ul",
                ol_list: "ol",
                listItem: "li",
                heading: {
                    1: "h2",
                    2: "h3",
                    3: "h4",
                    4: "h5",
                    5: "h6",
                },
            },
            linkDestinationKey: 'url',
            imageSourceKey: 'url',
        })
        .processSync(markdownString).result;

    addIds(parsed, 0);

    return parsed;
}
*/