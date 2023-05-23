import {Editable, ReactEditor, Slate, withReact} from "slate-react";
import {createEditor, Node, Text, Element as SlateElement, Transforms, Editor} from "slate";
import {withHistory} from "slate-history";
import {Dispatch, SetStateAction, useCallback, useEffect, useMemo} from "react";
import withLinks, {SlateLinkBalloon} from "./withLinks";
import {withShortcuts} from "./shortcuts";
import {onHotkey} from "./hotkeys";
import {withCodeblocks} from "./codeblock";
import {onEnter} from "./onEnter";
import {onTabList, withLists} from "./list";
import withDeserializeMD from "./withDeserializeMD";
import "katex/dist/katex.min.css";
import InlineTex from "./InlineTex";
import withTex from "./withTex";
import BlockTex from "./BlockTex";
import withImages, {Image} from "./withImages";

export const customSlateEditorFactory = () => withImages(
    withTex(
        withLists(
            withCodeblocks(
                withLinks(
                    withShortcuts(
                        withDeserializeMD(
                            withHistory(
                                withReact(createEditor() as ReactEditor)
                            )
                        )
                    )
                )
            )
        )
    )
);

export interface SlateEditorProps {
    value: Node[],
    setValue: Dispatch<SetStateAction<Node[]>>,
    fontSize?: number,
    className?: string,
}

export default function SlateEditor({value, setValue, fontSize, className}: SlateEditorProps) {
    const editor = useMemo(customSlateEditorFactory, []);
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    return (
        <div className={`prose ${className || ""}`} style={{fontSize: fontSize || 20}}>
            {/* @ts-ignore */}
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Capture your thoughts"
                    spellCheck
                    autoFocus
                    onKeyDown={event => {
                        onTabList(event, editor);
                        // @ts-ignore not sure what isHotKey wants
                        onHotkey(event, editor);
                        onEnter(event, editor);
                    }}
                />
                <SlateLinkBalloon/>
            </Slate>
        </div>
    );
}

export function SlateReadOnly({value, fontSize, className}: {value: Node[], fontSize?: number, className?: string}) {
    const editor = useMemo(customSlateEditorFactory, []);
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    useEffect(() => {
        try {
            Transforms.delete(editor, {
                at: {
                    anchor: Editor.start(editor, []),
                    focus: Editor.end(editor, []),
                },
            });
        } catch (e) {
            console.log("did not delete editor");
        }

        // Removes empty node
        try {
            Transforms.removeNodes(editor, {
                at: [0],
            });
        } catch (e) {
            console.log("did not remove node");
        }

        // Insert array of children nodes
        Transforms.insertNodes(
            editor,
            value
        );
    }, [value]);

    return (
        <div className={`prose ${className || ""}`} style={{fontSize: fontSize || 20}}>
            {/* @ts-ignore */}
            <Slate editor={editor} value={value}>
                <Editable
                    readOnly={true}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Nothing written here!"
                />
            </Slate>
        </div>
    );
}

export const getPlainTextFromSlateValue = (value: Node[]) => value.map(node => getPlainTextFromSlateNode(node)).join("\n");

const getPlainTextFromSlateNode = (node: Node) => {
    if (Text.isText(node)) return node.text;
    if (SlateElement.isElement(node)) return getPlainTextFromSlateValue(node.children);
    return "";
}

const Element = ({attributes, children, element}) => {
    switch (element.type) {
        case "blockquote":
            return <blockquote {...attributes}>{children}</blockquote>;
        case "ul":
            return <ul {...attributes}>{children}</ul>;
        case "h1":
            return <h1 {...attributes}>{children}</h1>;
        case "h2":
            return <h2 {...attributes}>{children}</h2>;
        case "h3":
            return <h3 {...attributes}>{children}</h3>;
        case "h4":
            return <h4 {...attributes}>{children}</h4>;
        case "li":
            return <li {...attributes}>{children}</li>;
        case "ol":
            return <ol {...attributes}>{children}</ol>;
        case "a":
            return <a {...attributes} href={element.url}>{children}</a>;
        case "codeblock":
            return <pre {...attributes}><code>{children}</code></pre>;
        case "inlineTex":
            return <InlineTex attributes={attributes} element={element}>{children}</InlineTex>;
        case "blockTex":
            return <BlockTex attributes={attributes} element={element}>{children}</BlockTex>;
        case "img":
            return <Image attributes={attributes} element={element}>{children}</Image>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Leaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};