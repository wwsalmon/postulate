import {Node} from "slate";
import {withReact} from "slate-react";
import {createEditorPlugins} from "@udecode/slate-plugins";
import {pluginsFactory} from "../../utils/slate/slatePlugins";
import {customSerializeHTMLFromNodes} from "../../utils/slate/customSerializeHTMLFromNodes";
import {useEffect, useRef} from "react";

export default function SlateReadOnly({nodes, projectId, projectName, ownerName, isOwner}: {
    nodes: Node[],
    projectId?: string,
    projectName?: string,
    ownerName?: string,
    isOwner?: boolean
}) {
    const editor = withReact(createEditorPlugins());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // @ts-ignore
        if (window.twttr && ref.current) {
            // @ts-ignore
            window.twttr.widgets.load(ref.current);
        }
    // @ts-ignore
    }, []);

    const htmlString = customSerializeHTMLFromNodes(editor, {
        plugins: pluginsFactory(),
        nodes: nodes,
    });

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: htmlString
            }}
            className="slate-read-only-container"
            ref={ref}
        />
    )
}