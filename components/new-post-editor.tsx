import React, {useState} from "react";
import MDEditor from "./md-editor";
import SpinnerButton from "./spinner-button";
import {DatedObj, ProjectObj, UserObj} from "../utils/types";
import Select from "react-select";

export default function NewPostEditor(props: {
    body?: string,
    title?: string,
    tempId: string,
    startProjectId: string,
    projects: {projects: DatedObj<ProjectObj>[]},
    sharedProjects: {projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] },
    onSaveEdit: (projectId: string, title: string, body: string) => void,
    onCancelEdit: () => void,
    getProjectLabel: (projectId: string) => string,
    isEditLoading: boolean,
}) {
    const [body, setBody] = useState<string>(props.body);
    const [title, setTitle] = useState<string>(props.title);
    const [projectId, setProjectId] = useState<string>(props.startProjectId);

    return (
        <>
            <h3 className="up-ui-title mb-4">Title</h3>
            <input
                type="text"
                className="w-full text-xl h-12"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Add a title"
            />
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-4">Project</h3>
            <Select
                options={[
                    ...(props.projects && props.projects.projects && props.projects.projects.length > 0) ? props.projects.projects.map(project => ({
                        value: project._id,
                        label: props.getProjectLabel(project._id),
                    })) : [],
                    ...(props.sharedProjects && props.sharedProjects.projects && props.sharedProjects.projects.length > 0) ? props.sharedProjects.projects.map(project => ({
                        value: project._id,
                        label: props.getProjectLabel(project._id),
                    })) : [],
                ]}
                value={{
                    value: projectId,
                    label:props.getProjectLabel(projectId)
                }}
                onChange={option => setProjectId(option.value)}
                className="mt-4 content"
                styles={{
                    menu: provided => ({...provided, zIndex: 6}),
                }}
            />
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-4">Body</h3>
            <div className="content prose w-full">
                <MDEditor
                    body={body}
                    setBody={setBody}
                    imageUploadEndpoint={`/api/upload?projectId=${projectId}&attachedType=post&attachedUrlName=${props.tempId}`}
                    placeholder="Turn your snippets into a shareable post!"
                />
            </div>
            <div className="flex mt-4">
                <SpinnerButton isLoading={props.isEditLoading} onClick={() => props.onSaveEdit(projectId, title, body)} isDisabled={!body || !title}>
                    {props.title ? "Save" : "Post"}
                </SpinnerButton>
                <button className="up-button text" onClick={props.onCancelEdit} disabled={props.isEditLoading}>Cancel</button>
            </div>
        </>
    );
}