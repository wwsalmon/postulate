import {CustomEditor, CustomElement} from "./slate-types";
import {insertNodesAndClearEmpty} from "./withDeserializeMD";
import {ReactNode} from "react";
import {useFocused, useSelected} from "slate-react";

const withImages = (editor: CustomEditor) => {
    const {insertData, isVoid} = editor;

    editor.isVoid = element => element.type === "img" || isVoid(element);

    // largely from https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx
    editor.insertData = (data) => {
        const {files} = data;

        if (files && files.length) {
            for (const file of Array.from(files)) {
                const reader = new FileReader();
                const [mime] = file.type.split("/");

                if (mime === "image") {
                    reader.addEventListener("load", () => {
                        const url = reader.result.toString();
                        insertImage(editor, url);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else {
            insertData(data);
        };
    };

    return editor;
};

const insertImage = (editor: CustomEditor, src: string) => {
    // console.log("inserting image");

    const text = {text: ""};
    const image = {type: "img", src, children: [text]};
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
                <img src={element.src} className={showOutline ? "border-2 border-blue-500" : ""}/>
            </div>
            {children}
        </div>
    );
}

export default withImages;