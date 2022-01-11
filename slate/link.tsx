import isUrl from "is-url";
import {Editor, Element, NodeEntry, Range, Transforms,} from "slate";
import {useEffect, useRef, useState} from "react";
import {ReactEditor, useSlate} from "slate-react";
import {Node} from "slate";
import ReactDOM from "react-dom";
import Button from "../components/headless/Button";
import {FiEdit2} from "react-icons/fi";
import {BiUnlink} from "react-icons/bi";
import normalizeUrl from "normalize-url";

export const withLinks = editor => {
    const {insertData, insertText, isInline} = editor;

    editor.isInline = element => {
        return element.type === "a" ? true : isInline(element);
    };

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = data => {
        const text = data.getData("text/plain");

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

export const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, normalizeUrl(url));
    }
};

const getActiveLink = editor => {
    // @ts-ignore
    const [link] = Editor.nodes(editor, {
        match: n => Element.isElement(n) && n.type === "a",
    });
    return link as NodeEntry<Element>;
};

const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
        match: n => Element.isElement(n) && n.type === "a",
    });
};

const wrapLink = (editor, href) => {
    const activeLink = getActiveLink(editor);

    if (!!activeLink) {
        unwrapLink(editor);
    }

    const {selection} = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: Node = {
        type: "a",
        href,
        children: isCollapsed ? [{text: href}] : [],
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, {split: true});
        Transforms.collapse(editor, {edge: "end"});
    }
};

const updateLink = (editor, href) => {
    const {selection} = editor;

    const activeLink = getActiveLink(editor);

    if (!activeLink) return;

    const path = activeLink[1];

    Transforms.select(editor, path);
    unwrapLink(editor);
    wrapLink(editor, normalizeUrl(href));
    Transforms.setSelection(editor, selection);
};

export const SlateLinkBalloon = () => {
    const ref = useRef<HTMLDivElement | null>();
    const editor = useSlate();

    const [link, setLink] = useState<string>("");
    const [newLink, setNewLink] = useState<string>("");

    useEffect(() => {
        const el = ref.current;
        const {selection} = editor;
        const activeLink = getActiveLink(editor);

        if (!el) {
            return;
        }

        if (
            !selection ||
            !ReactEditor.isFocused(editor as ReactEditor) ||
            !activeLink
        ) {
            el.style.opacity = "0";
            setTimeout(() => {
                el.style.display = "none";
            }, 200);
            return;
        }

        setLink(activeLink[0].href);
        setNewLink(activeLink[0].href);
        const domSelection = window.getSelection();
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.display = "flex";
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 8}px`;
        el.style.left = `${rect.left +
        window.pageXOffset -
        el.offsetWidth / 2 +
        rect.width / 2}px`;
    }, [ref.current, editor.selection]);

    return (
        <Portal>
            <div ref={ref} className="absolute transition-all bg-gray-100 p-2 rounded shadow-md flex items-center">
                <a className="underline font-medium" href={link}>{link}</a>
                <Button
                    containerClassName="ml-2 flex items-center"
                    className="p-1"
                    onMouseDown={e => {
                        e.preventDefault();
                        const href = window.prompt("Edit the URL of the link:", link);
                        if (!href) return;
                        updateLink(editor, href);
                    }}
                ><FiEdit2/></Button>
                <Button
                    containerClassName="ml-2 flex items-center"
                    className="p-1"
                    onClick={() => unwrapLink(editor)}
                ><BiUnlink/></Button>
            </div>
        </Portal>
    );
};

const Portal = ({children}) => {
    return typeof document === "object"
        ? ReactDOM.createPortal(children, document.body)
        : null;
};