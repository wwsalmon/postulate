/**
 * Allows for pasting images from clipboard.
 * Not yet: dragging and dropping images, selecting them through a file system dialog.
 * @param options.type
 * @param options.uploadImage
 */
import {insertImage, isImageUrl, WithImageUploadOptions} from "@udecode/slate-plugins-image";
import {SPEditor, WithOverride} from "@udecode/slate-plugins-core";
import {ReactEditor} from "slate-react";

export const customWithImageUpload = ({
    uploadImage,
}: WithImageUploadOptions = {}): WithOverride<ReactEditor & SPEditor> => (
    editor
) => {
    const { insertData } = editor;

    editor.insertData = (data: DataTransfer) => {
        const text = data.getData('text/plain');
        const { files } = data;
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener('load', async () => {
                        if (!reader.result) {
                            return;
                        }
                        const uploadedUrl = uploadImage
                            ? await uploadImage(reader.result)
                            : reader.result;

                        insertImage(editor, uploadedUrl);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};
