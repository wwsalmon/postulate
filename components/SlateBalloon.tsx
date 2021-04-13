import {PortalBody} from "@udecode/slate-plugins-ui-fluent";
import {useEffect, useRef, useState} from "react";
import {
    getBalloonToolbarStyles,
    setPositionAtSelection,
    Toolbar,
    useBalloonMove,
    useBalloonShow
} from "@udecode/slate-plugins-toolbar";
import {useTSlate} from "@udecode/slate-plugins-core";
import {
    ELEMENT_H2,
    MARK_BOLD,
    MARK_ITALIC,
    ToolbarElement,
    ToolbarLink,
    ToolbarMark,
    useSlatePluginType
} from "@udecode/slate-plugins";
import {BiBold, BiHeading, BiItalic, BiLink} from "react-icons/bi";

export default function SlateBalloon() {
    const ref = useRef<HTMLDivElement>(null);
    const editor = useTSlate();

    const [selectionHidden] = useBalloonShow({editor, ref, hiddenDelay: 0});
    useBalloonMove({editor, ref, direction: "top"});
    const [linkHidden, setLinkHidden] = useState<boolean>(true);

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
                if (types.includes("a")) setLinkHidden(false);
                else setLinkHidden(true);
            } else setLinkHidden(true);
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
                    (selectionHidden && linkHidden),
                    0,
                    "top",
                    false
                )}
            >
                {!linkHidden ? (
                    <p>test</p>
                ) : (
                    <>
                        <ToolbarMark
                            type={useSlatePluginType(MARK_BOLD)}
                            icon={<BiBold/>}
                        />
                        <ToolbarMark
                        type={useSlatePluginType(MARK_ITALIC)}
                        icon={<BiItalic/>}
                        />
                        <ToolbarLink icon={<BiLink/>}/>
                        <ToolbarElement type={useSlatePluginType(ELEMENT_H2)} icon={<BiHeading/>}/>
                    </>
                )}
            </Toolbar>
        </PortalBody>
    )
}