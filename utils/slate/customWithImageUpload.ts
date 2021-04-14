/**
 * Allows for pasting images from clipboard.
 * Not yet: dragging and dropping images, selecting them through a file system dialog.
 * @param options.type
 * @param options.uploadImage
 */
import {insertImage, isImageUrl, WithImageUploadOptions} from "@udecode/slate-plugins-image";
import {SPEditor, WithOverride} from "@udecode/slate-plugins-core";
import {ReactEditor} from "slate-react";
import {insertNodes} from "@udecode/slate-plugins-common";
import {Transforms} from "slate";
import upload from "../../pages/api/upload";

export const customWithImageUpload = ({
    uploadImage,
}: {uploadImage: (file: File) => Promise<string>}): WithOverride<ReactEditor & SPEditor> => (
    editor
) => {
    const { insertData } = editor;

    editor.insertData = (data: DataTransfer) => {
        const { files } = data;
        if (files && files.length > 0) {
            for (const file of files) {
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    insertNodes(editor, {
                        type: "loading",
                        children: [{text: ""}],
                    });

                    uploadImage(file).then(url => {
                        // @ts-ignore bc node.type threw error
                        Transforms.removeNodes(editor, { match: (node) => node.type === "loading" });
                        insertImage(editor, url);
                    });
                }
            }
        } else {
            insertData(data);
        }
    };

    return editor;
};
