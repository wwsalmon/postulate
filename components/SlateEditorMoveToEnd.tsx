import {useEffect} from 'react';
import {Node, Transforms} from "slate";
import {useTSlate} from "@udecode/slate-plugins-core";

export default function SlateEditorMovetoEnd({initBody, startNode}: { initBody?: Node[], startNode?: number }) {
    const editor = useTSlate();

    useEffect(() => {
        try {
            if (editor && initBody) {
                Transforms.select(editor, [startNode,0]);
                Transforms.collapse(editor, {edge: "end"});
            }
        } catch (e) {}
    }, []);

    return (
        <></>
    );
}