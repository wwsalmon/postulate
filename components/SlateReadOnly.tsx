import {Node} from "slate";
import {withReact} from "slate-react";
import {createEditorPlugins} from "@udecode/slate-plugins";
import {pluginsFactory} from "../utils/slate/slatePlugins";
import {customSerializeHTMLFromNodes} from "../utils/slate/customSerializeHTMLFromNodes";

export default function SlateReadOnly({nodes}: { nodes: Node[] }) {
    const editor = withReact(createEditorPlugins());

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: customSerializeHTMLFromNodes(editor, {
                    plugins: pluginsFactory(),
                    nodes: nodes,
                })
            }}
            className="whitespace-pre-wrap"
        />
    )
}