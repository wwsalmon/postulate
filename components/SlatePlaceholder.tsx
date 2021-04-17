import {useTSlate} from "@udecode/slate-plugins-core";
import {Element, Text} from "slate";

export default function SlatePlaceholder() {
    const {children} = useTSlate();
    const isEmpty = children.every(d => getIsEmpty(d));

    function getIsEmpty(node: Element | Text) {
        if (("children" in node && !node.children.length) || "text" in node && node.text === "") return true;
        if ("children" in node) return node.children.every(d => getIsEmpty(d));
        return false;
    }

    return isEmpty ? (
        <p className="opacity-50 absolute">Write something great...</p>
    ) : <></>;
}