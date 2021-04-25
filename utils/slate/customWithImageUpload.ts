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
import {ELEMENT_CODE_BLOCK, getSlatePluginType, someNode} from "@udecode/slate-plugins";

export const customWithImageUpload = ({
    uploadImage,
}: {uploadImage: (file: File) => Promise<string>}): WithOverride<ReactEditor & SPEditor> => (
    editor
) => {
    const { insertData } = editor;

    editor.insertData = (data: DataTransfer) => {
        const type = getSlatePluginType(editor, ELEMENT_CODE_BLOCK);
        const isCodeBlock = someNode(editor, { match: { type } });
        const { files } = data;

        if (files && files.length > 0) {
            if (isCodeBlock) return;
            for (const file of files) {
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    // if greater than 2 MB
                    if ((file.size / 1024 / 1024) > 2) {
                        window.alert("Maximum allowed filesize is 2MB");
                    } else {
                        insertNodes(editor, {
                            type: "loading",
                            children: [{text: ""}],
                        });

                        uploadImage(file).then(url => {
                            // @ts-ignore bc node.type threw error
                            Transforms.removeNodes(editor, { match: (node) => node.type === "loading" });
                            insertImage(editor, url);
                        }).catch(e => {
                            // @ts-ignore bc node.type threw error
                            Transforms.removeNodes(editor, { match: (node) => node.type === "loading" });
                            window.alert("Image upload failed: " + e);
                        });
                    }
                }
            }
        } else {
            insertData(data);
        }
    };

    return editor;
};
