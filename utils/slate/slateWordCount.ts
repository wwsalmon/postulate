import {Node} from "slate";

export default function slateWordCount(body: Node[]) {
    let length = 0;
    if (!body || !body.length) return 0;
    for (let node of body) {
        // @ts-ignore
        if (node.text) length += node.text.split(/\b\W+\b/).length;
        // @ts-ignore
        else length += slateWordCount(node.children);
    }
    return length;
}