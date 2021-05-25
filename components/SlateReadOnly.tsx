import {Node} from "slate";
import {withReact} from "slate-react";
import {createEditorPlugins} from "@udecode/slate-plugins";
import {pluginsFactory} from "../utils/slate/slatePlugins";
import {customSerializeHTMLFromNodes} from "../utils/slate/customSerializeHTMLFromNodes";
import {useEffect, useRef} from "react";
import SubscriptionInsert from "./SubscriptionInsert";

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

    const htmlPieces = htmlString
        .split(/(?=(\[\[cta\]\]))|(?<=(\[\[cta\]\]))/g)
        .filter((d, i, a) => (i === 0 || a[i - 1] !== undefined) && d !== undefined);

    return (
        <>
            {htmlPieces.map((d, i, a) => d === "[[cta]]" ? projectId && projectName && ownerName && (isOwner !== undefined) && (
                <>
                    {i !== 0 && (
                        <hr style={{margin: "2rem 0"}}/>
                    )}
                    <SubscriptionInsert
                        projectId={projectId}
                        projectName={projectName}
                        ownerName={ownerName}
                        isOwner={isOwner}
                    />
                    {i !== a.length - 1 && (
                        <hr style={{margin: "2rem 0"}}/>
                    )}
                </>
            ) : (
                <div
                    dangerouslySetInnerHTML={{
                        __html: d
                    }}
                    className="slate-read-only-container"
                    ref={ref}
                />
            ))}
        </>
    )
}