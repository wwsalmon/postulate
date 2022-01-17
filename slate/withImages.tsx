import {CustomEditor, CustomElement} from "./slate-types";
import {insertNodesAndClearEmpty} from "./withDeserializeMD";
import {ReactNode} from "react";
import {useFocused, useSelected} from "slate-react";
import {Element, Node} from "slate";
import axios from "axios";

const withImages = (editor: CustomEditor) => {
    const {insertData, isVoid} = editor;

    editor.isVoid = element => element.type === "img" || isVoid(element);

    // largely from https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx
    editor.insertData = (data) => {
        const {files} = data;

        if (files && files.length) {
            const file = files[0];
            const [mime] = file.type.split("/");

            if (mime === "image") {
                // if greater than 2 MB
                if ((file.size / 1024 / 1024) > 2) {
                    return window.alert("Maximum allowed filesize is 2MB");
                }

                const form = new FormData();
                form.append("image", file);

                axios.post("/api/upload", form).then(res => {
                    const url = res.data.filePath;
                    insertImage(editor, url);
                });
            }
        }

        insertData(data);
    };

    return editor;
};

const insertImage = (editor: CustomEditor, url: string) => {
    // console.log("inserting image");

    const text = {text: ""};
    const image = {type: "img", url, children: [text]};
    insertNodesAndClearEmpty(editor, image);
};

export function Image({
                                      attributes,
                                      children,
                                      element
                                  }: { attributes: any, children: ReactNode, element: CustomElement }) {
    const focused = useFocused();
    const selected = useSelected();
    const showOutline = focused && selected;

    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <img src={element.url} className={showOutline ? "border-2 border-blue-500" : ""}/>
            </div>
            {children}
        </div>
    );
}

export const findImages = (nodes: Node[]) => {
    let images = [];
    for (let node of nodes) {
        if (!Element.isElement(node)) continue;
        if (node.type === "img") images.push(node.url);
        if (node.children) images.push(...findImages(node.children));
    }
    return images;
}

export default withImages;