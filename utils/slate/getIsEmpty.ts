import {Element, Text} from "slate";

export default function getIsEmpty(node: Element | Text) {
    if (("children" in node && !node.children.length) || "text" in node && node.text === "") return true;
    if ("children" in node) return node.children.every(d => getIsEmpty(d));
    return false;
}