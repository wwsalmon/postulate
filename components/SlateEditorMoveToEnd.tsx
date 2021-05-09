import {useEffect} from 'react';
import {Node, Transforms} from "slate";
import {useTSlate} from "@udecode/slate-plugins-core";

export default function SlateEditorMovetoEnd({initBody}: { initBody?: Node[] }) {
    const editor = useTSlate();

    useEffect(() => {
        try {
            if (editor && initBody) {
                Transforms.select(editor, [1,0]);
                Transforms.collapse(editor, {edge: "end"});
            }
        } catch (e) {}
    }, []);

    return (
        <></>
    );
}