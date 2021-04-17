import {Node} from "slate";
import {withReact} from "slate-react";
import {createEditorPlugins, serializeHTMLFromNodes} from "@udecode/slate-plugins";
import {pluginsFactory} from "../utils/slate/slatePlugins";

export default function SlateReadOnly({nodes}: { nodes: Node[] }) {
    const editor = withReact(createEditorPlugins());

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: serializeHTMLFromNodes(editor, {
                    plugins: pluginsFactory(),
                    nodes: nodes,
                })
            }}
        />
    )
}