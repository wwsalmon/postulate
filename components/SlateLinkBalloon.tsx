import {PortalBody} from "@udecode/slate-plugins-ui-fluent";
import {useEffect, useRef, useState} from "react";
import {getBalloonToolbarStyles, setPositionAtSelection, Toolbar, useBalloonMove} from "@udecode/slate-plugins-toolbar";
import {useTSlate} from "@udecode/slate-plugins-core";

export default function SlateLinkBalloon() {
    const ref = useRef<HTMLDivElement>(null);
    const editor = useTSlate();
    useBalloonMove({ editor, ref, direction: "top" });

    const [hidden, setHidden] = useState<boolean>(false);

    // something like useBalloonShow
    useEffect(() => {
        if (editor.selection) {
            const {anchor, focus} = editor.selection;
            // if no selection, just cursor
            if (anchor === focus) {
                let lastNode = editor;
                let types = [];
                // traverse document to see if there is a link at the cursor
                for (let layerIndex of anchor.path) {
                    if (lastNode.type) types.push(lastNode.type);
                    lastNode = lastNode.children[layerIndex];
                }
                if (types.includes("a")) setHidden(false);
                else setHidden(true);
            } else setHidden(true);
        }
    }, [editor.selection]);

    // replicated useBalloonMove hook
    useEffect(() => {
        if (editor.selection) {
            const {anchor, focus} = editor.selection;
            if (ref.current && (anchor === focus)) setPositionAtSelection(ref.current, "top");
        }
    }, [editor.selection, ref]);

    return (
        <PortalBody>
            <Toolbar
                ref={ref}
                styles={getBalloonToolbarStyles(
                    undefined,
                    undefined,
                    "dark",
                    hidden,
                    0,
                    "top",
                    true
                )}
            >
                <p>test</p>
            </Toolbar>
        </PortalBody>
    )
}