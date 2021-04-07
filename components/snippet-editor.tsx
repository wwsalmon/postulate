import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {DatedObj, SnippetObj} from "../utils/types";
import SpinnerButton from "./spinner-button";
import MDEditor from "./md-editor";
import Creatable from "react-select/creatable";
import {format} from "date-fns";
import short from "short-uuid";
import EasyMDE from "easymde";

export default function SnippetEditor({isSnippet = false, snippet = null, projectId = null, availableTags, isLoading, onSaveEdit, onCancelEdit, setInstance, disableSave}: {
    isSnippet?: boolean,
    snippet?: DatedObj<SnippetObj>,
    projectId?: string,
    availableTags: string[],
    isLoading: boolean,
    onSaveEdit: (urlName: string, isSnippet: boolean, body: string, url: string, tags: string[]) => void,
    onCancelEdit: (urlName: string) => void,
    setInstance: Dispatch<SetStateAction<EasyMDE>>,
    disableSave?: boolean,
}) {
    const [body, setBody] = useState<string>(snippet ? snippet.body : "");
    const [url, setUrl] = useState<string>(snippet ? snippet.url : "");
    const [tags, setTags] = useState<string[]>(snippet ? snippet.tags : []);
    const [urlName, setUrlName] = useState<string>(snippet ? snippet.urlName : format(new Date(), "yyyy-MM-dd-") + short.generate());
    const [isSnippetState, setIsSnippetState] = useState<boolean>(snippet ? snippet.type === "snippet" : isSnippet);

    useEffect(() => {
        window.onbeforeunload = !!body ? () => true : undefined;

        return () => {
            window.onbeforeunload = undefined;
        };
    }, [!!body]);

    useEffect(() => {
        if (!snippet) setIsSnippetState(isSnippet);
    }, [isSnippet])

    return (
        <>
            {((snippet && snippet.url) || !isSnippetState) && (
                <input
                    type="text"
                    className="content px-4 py-2 border rounded-md w-full mb-8"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Resource URL"
                />
            )}
            <div className="content prose w-full">
                <MDEditor
                    body={body}
                    setBody={setBody}
                    imageUploadEndpoint={`/api/upload?projectId=${snippet ? snippet.projectId : projectId}&attachedType=snippet&attachedUrlName=${urlName}`}
                    placeholder={isSnippetState ? "Write down an interesting thought or development" : "Jot down some notes about this resource"}
                    id={isSnippetState ? (projectId || snippet._id) + "snippet" : (projectId || snippet._id) + "resource"}
                    setInstance={setInstance}
                />
            </div>
            <hr className="my-6"/>
            <p className="up-ui-title mb-4">Tags</p>
            <Creatable
                options={availableTags ? availableTags.map(d => ({label: d, value: d})) : []}
                value={tags ? tags.map(d => ({label: d, value: d})) : []}
                onChange={(newValue) => setTags(newValue.map(d => d.value))}
                isMulti
            />
            <p className="opacity-50 mt-4 text-xs text-right">Select an existing tag in this project or type to create a new one</p>
            <hr className="my-6"/>
            <div className="flex">
                <SpinnerButton
                    isLoading={isLoading}
                    onClick={() => onSaveEdit(urlName, isSnippetState, body, url, tags)}
                    isDisabled={disableSave || (isSnippetState && !body) || (!isSnippetState && !url)}
                >
                    Save
                </SpinnerButton>
                <button className="up-button text" onClick={() => onCancelEdit(urlName)}>Cancel</button>
            </div>
        </>
    );
}