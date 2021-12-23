import {useTSlate} from "@udecode/slate-plugins-core";
import getIsEmpty from "../../utils/slate/getIsEmpty";

export default function SlatePlaceholder() {
    const {children} = useTSlate();
    const isEmpty = children.length === 1 && children[0].type === "p" && (children[0].text === "" || (children[0].children && children[0].children.every(d => getIsEmpty(d))));

    return isEmpty ? (
        <p className="opacity-50 absolute">Write something great...</p>
    ) : <></>;
}