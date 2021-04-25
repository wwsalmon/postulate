import React, {Dispatch, SetStateAction, useState} from "react";
import {simpleMDEToolbar} from "../utils/utils";
import SimpleMDEEditor from "react-simplemde-editor";
import EasyMDE from "easymde";

export default function MDEditor({body, setBody, imageUploadEndpoint, placeholder, id, setInstance}: {
    body: string,
    setBody: Dispatch<SetStateAction<string>>,
    imageUploadEndpoint: string,
    placeholder: string,
    id: string,
    setInstance?: Dispatch<SetStateAction<EasyMDE>>,
}) {

    return (
        <SimpleMDEEditor
            value={body}
            onChange={setBody}
            options={{
                spellChecker: false,
                placeholder: placeholder,
                toolbar: simpleMDEToolbar,
                previewClass: "bg-white",
                uploadImage: true,
                imageUploadEndpoint: imageUploadEndpoint,
                autosave: {enabled: true, uniqueId: id},
            }}
            getMdeInstance={instance => setInstance && setInstance(instance)}
        />
    );
}