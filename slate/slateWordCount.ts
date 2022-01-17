import {Node} from "slate";

export default function slateWordCount(body: Node[]) {
    let length = 0;
    if (!body || !body.length) return 0;
    for (let node of body) {
        if ("text" in node) length += node.text.split(/\b\W+\b/).length;
        else length += slateWordCount(node.children);
    }
    return length;
}