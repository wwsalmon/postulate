import {useTSlate} from "@udecode/slate-plugins-core";
import getIsEmpty from "../utils/slate/getIsEmpty";

export default function SlatePlaceholder() {
    const {children} = useTSlate();
    const isEmpty = children.every(d => getIsEmpty(d));

    return isEmpty ? (
        <p className="opacity-50 absolute">Write something great...</p>
    ) : <></>;
}