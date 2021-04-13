import {PortalBody} from "@udecode/slate-plugins-ui-fluent";
import {useEffect, useRef, useState} from "react";
import {
    getBalloonToolbarStyles,
    setPositionAtSelection,
    Toolbar, ToolbarButton,
    useBalloonMove,
    useBalloonShow
} from "@udecode/slate-plugins-toolbar";
import {getSlatePluginType, useTSlate} from "@udecode/slate-plugins-core";
import {
    ELEMENT_H2, ELEMENT_LINK,
    MARK_BOLD,
    MARK_ITALIC,
    ToolbarElement,
    ToolbarLink,
    ToolbarMark, unwrapNodes, upsertLinkAtSelection,
    useSlatePluginType, wrapLink
} from "@udecode/slate-plugins";
import {BiBold, BiCheck, BiHeading, BiItalic, BiLink, BiPencil, BiUnlink, BiX} from "react-icons/bi";
import ellipsize from "ellipsize";
import {Editor, Transforms} from "slate";

export default function SlateBalloon() {
    const ref = useRef<HTMLDivElement>(null);
    const linkEditorRef = useRef<HTMLInputElement>(null);
    const editor = useTSlate();

    const [selectionHidden] = useBalloonShow({editor, ref, hiddenDelay: 0});
    useBalloonMove({editor, ref, direction: "top"});
    const [linkHidden, setLinkHidden] = useState<boolean>(true);
    const [linkUrl, setLinkUrl] = useState<string>("");
    const [linkUrlEdit, setLinkUrlEdit] = useState<string>("");
    const [linkEdit, setLinkEdit] = useState<boolean>(false);
    const [linkPosition, setLinkPosition] = useState<any>(null);

    function clearLink() {
        setLinkHidden(true);
        setLinkUrl("");
        setLinkEdit(false);
        setLinkPosition(null);
    }

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
                    if (lastNode.url && lastNode.url !== linkUrl) {
                        setLinkUrl(lastNode.url);
                        setLinkUrlEdit(lastNode.url);
                        setLinkPosition(editor.selection);
                    }
                    lastNode = lastNode.children[layerIndex];
                }
                if (types.includes("a")) setLinkHidden(false);
                else clearLink();
            } else clearLink();
        }
    }, [editor.selection]);

    // replicated useBalloonMove hook
    useEffect(() => {
        if (editor.selection) {
            const {anchor, focus} = editor.selection;
            if (ref.current && (anchor === focus)) setPositionAtSelection(ref.current, "top");
        }
    }, [editor.selection, ref]);

    function unlink() {
        unwrapNodes(editor, {at: linkPosition, match: {type: getSlatePluginType(editor, ELEMENT_LINK)}});
        clearLink();
    }

    function saveLink(newUrl: string) {
        const linkType = getSlatePluginType(editor, ELEMENT_LINK);
        const [, inlinePath] = Editor.leaf(editor, linkPosition);
        // select text that's about to be unlinked (making the path itself unusable)
        Transforms.select(editor, inlinePath);
        // unlink and re-link selected texts
        unwrapNodes(editor, {at: linkPosition, match: {type: linkType}});
        wrapLink(editor, { at: editor.selection, url: newUrl });
        // collapse cursor back to single point
        Transforms.collapse(editor, { edge: 'end' });
        // set balloon state vars
        setLinkUrl(newUrl);
        setLinkEdit(false);
    }

    useEffect(() => {
        const linkEditorEnter = e => {
            if (e.key === "Enter") saveLink(e.target.value);
        }

        if (linkEditorRef.current) linkEditorRef.current.addEventListener("keyup", linkEditorEnter);

        return () => {
            if (linkEditorRef.current) linkEditorRef.current.removeEventListener("keyup", linkEditorEnter);
        }
    }, [linkEditorRef.current])

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
                    <>
                        {linkEdit ? (
                            <>
                                <input
                                    value={linkUrlEdit}
                                    onChange={e => setLinkUrlEdit(e.target.value)}
                                    className="py-1 px-2 w-64"
                                    ref={linkEditorRef}
                                />
                                <ToolbarButton icon={<BiCheck/>} onMouseDown={() => saveLink(linkUrlEdit)}/>
                            </>
                        ) : (
                            <>
                                <div className="px-2">
                                    <a href={linkUrl} target="_blank">{ellipsize(linkUrl, 30)}</a>
                                </div>
                                <ToolbarButton icon={<BiPencil/>} onMouseDown={() => setLinkEdit(true)}/>
                            </>
                        )}
                        <ToolbarButton icon={<BiUnlink/>} onMouseDown={unlink}/>
                    </>
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