import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import SpinnerButton from "./spinner-button";
import {DatedObj, EmailObj, privacyTypes, ProjectObj, SubscriptionObjGraph, UserObj} from "../utils/types";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";
import EasyMDE from "easymde";
import {Node} from "slate";
import SlateEditor from "./SlateEditor";
import {fetcher, slateInitValue} from "../utils/utils";
import {stripHtml} from "string-strip-html";
import useSWR, {responseInterface} from "swr";
import {format} from "date-fns";
import getIsEmpty from "../utils/slate/getIsEmpty";
import UpInlineButton from "./style/UpInlineButton";

export default function NewPostEditor(props: {
    body?: string,
    slateBody?: Node[],
    title?: string,
    postId?: string,
    privacy?: privacyTypes,
    tags?: string[],
    tempId: string,
    startProjectId: string,
    projects: {projects: DatedObj<ProjectObj>[]},
    sharedProjects: {projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] },
    onSaveEdit: (projectId: string, title: string, body: string | Node[], privacy: privacyTypes, tags: string[], isSlate: boolean, sendEmail: boolean, date?: Date) => void,
    onCancelEdit: () => void,
    getProjectLabel: (projectId: string) => string,
    isEditLoading: boolean,
    setInstance: Dispatch<SetStateAction<EasyMDE>>,
}) {
    const [autoSavedBody, setAutoSavedBody] = useState<Node[]>(null);
    const [autoSaveUsed, setAutoSaveUsed] = useState<boolean>(false);
    const [slateBody, setSlateBody] = useState<Node[]>(props.slateBody || slateInitValue);
    const [title, setTitle] = useState<string>(props.title);
    const titleElem = useRef<HTMLHeadingElement>(null)
    const [projectId, setProjectId] = useState<string>(props.startProjectId);
    const [privacy, setPrivacy] = useState<privacyTypes>(props.privacy || "public");
    const [tags, setTags] = useState<string[]>(props.tags || []);
    const [sendEmail, setSendEmail] = useState<boolean>(false);
    const [backDate, setBackDate] = useState<boolean>(false);
    const [date, setDate] = useState<string>("");

    const {data: email, error: emailError}: responseInterface<{ email: DatedObj<EmailObj> }, any> = useSWR(`/api/email?targetId=${props.postId || ""}`, props.postId ? fetcher : () => null);
    const {data: subscriptions, error: subscriptionsError}: responseInterface<{ subscriptions: DatedObj<SubscriptionObjGraph>[] }, any> = useSWR(`/api/subscription?projectId=${projectId}&stats=true`);

    const emailReady = email && email.email;
    const emailExists = emailReady && !!email.email._id;
    const thisEmail = emailReady && emailExists && email.email;
    const subscriptionsReady = subscriptions && subscriptions.subscriptions;
    const subscriptionsLength = subscriptionsReady ? subscriptions.subscriptions.length : 0;

    const privacyOptions = [
        {
            label: "Public (appears on profile)",
            value: "public",
        },
        {
            label: "Unlisted (link accessible, but doesn't appear on profile)",
            value: "unlisted",
        },
        {
            label: "Private (not accessible by non-collaborators)",
            value: "private",
        },
        {
            label: "Draft (not accessible by non-collaborators)",
            value: "draft",
        }
    ];

    function promiseOptions(inputValue, cb) {
        axios.get(`/api/tag?query=${inputValue}`).then(res => {
            cb(res.data.tags.map(d => ({label: d.key, value: d.key})));
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        window.onbeforeunload = !slateBody.every(d => getIsEmpty(d)) ? () => true : undefined;

        return () => {
            window.onbeforeunload = undefined;
        };
    }, [!!slateBody]);

    useEffect(() => {
        function pasteListener(e) {
            e.preventDefault();
            let paste = (e.clipboardData).getData("text");
            paste = stripHtml(paste).result;
            const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));
        }

        if (titleElem.current) {
            titleElem.current.addEventListener("paste", pasteListener);
        }

        return () => titleElem.current && titleElem.current.removeEventListener("paste", pasteListener);
    }, [titleElem.current]);

    useEffect(() => {
        if (!slateBody.every(d => getIsEmpty(d))) {
            localStorage.setItem("postulatePostBody", JSON.stringify(slateBody));
        }
    }, [slateBody]);

    useEffect(() => {
        const initAutoSavedBody = JSON.parse(localStorage.getItem("postulatePostBody"));
        if (initAutoSavedBody) setAutoSavedBody(initAutoSavedBody);
    }, []);

    return (
        <>
            <div className="relative">
                <h1
                    className="w-full up-h1 mb-4 py-2 relative z-10"
                    contentEditable
                    onInput={e => setTitle(e.currentTarget.textContent)}
                    onPaste={e => setTitle(e.target.textContent)}
                    ref={titleElem}
                    suppressContentEditableWarning
                >
                    {props.title}
                </h1>
                {!title && (
                    <h1 className="up-h1 py-2 opacity-25 absolute top-0">
                        Add a title
                    </h1>
                )}
            </div>
            {autoSavedBody && !autoSaveUsed && (
                <>
                    <span>Autosave available: </span>
                    <UpInlineButton
                        onClick={() => {
                            setSlateBody(autoSavedBody);
                            setAutoSaveUsed(true);
                        }}
                    >
                        Recover
                    </UpInlineButton>
                </>
            )}
            <div className="content prose w-full" style={{maxWidth: "unset", minHeight: 300}}>
                <SlateEditor
                    body={slateBody}
                    setBody={setSlateBody}
                    projectId={projectId}
                    urlName={props.tempId}
                    isPost={true}
                    id="postEditor"
                />
            </div>

            <hr className="my-8"/>
            <div className="flex -mx-4 w-full">
                <div className="mx-4 w-1/2">
                    <h3 className="up-ui-title mb-4">Project</h3>
                    <Select
                        options={[
                            ...((props.projects && props.projects.projects && props.projects.projects.length > 0) ? props.projects.projects.map(project => ({
                                value: project._id,
                                label: props.getProjectLabel(project._id),
                            })) : []),
                            ...((props.sharedProjects && props.sharedProjects.projects && props.sharedProjects.projects.length > 0) ? props.sharedProjects.projects.map(project => ({
                                value: project._id,
                                label: props.getProjectLabel(project._id),
                            })) : []),
                        ]}
                        value={{
                            value: projectId,
                            label:props.getProjectLabel(projectId)
                        }}
                        onChange={option => setProjectId(option.value)}
                        styles={{
                            menu: provided => ({...provided, zIndex: 6}),
                        }}
                    />
                </div>
                <div className="mx-4 w-1/2">
                    <h3 className="up-ui-title mb-4">Visibility</h3>
                    <Select
                        options={privacyOptions}
                        value={privacyOptions.find(d => d.value === privacy)}
                        onChange={option => setPrivacy(option.value)}
                        styles={{
                            menu: provided => ({...provided, zIndex: 6}),
                        }}
                    />
                </div>
            </div>

            <div className="my-8">
                <h3 className="up-ui-title mb-4">Tags</h3>
                <AsyncCreatableSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseOptions}
                    value={tags.map(d => ({label: d, value: d}))}
                    onChange={newValue => setTags(newValue.map(d => d.value))}
                    styles={{
                        menu: provided => ({...provided, zIndex: 6}),
                    }}
                />
                <p className="opacity-50 mt-4 text-xs text-right">Select an existing tag or type to create a new one</p>
            </div>

            <div className="my-8">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="backDate"
                        checked={backDate}
                        onChange={e => setBackDate(e.target.checked)}
                        className="mr-4 w-4 h-4"
                    />
                    <label htmlFor="backDate" className="up-gray-400">Backdate this post</label>
                </div>
                {backDate && (
                    <div className="my-4">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 bg-white up-border-gray-300 h-10 w-full rounded-md"/>
                    </div>
                )}
            </div>

            <hr className="my-8"/>

            <div className="my-8 flex items-center">
                {subscriptionsReady && !!subscriptionsLength && !(emailReady && emailExists) && (privacy === "public" || privacy === "unlisted") && (
                    <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={e => setSendEmail(e.target.checked)}
                        className="mr-4 w-4 h-4"
                    />
                )}
                <div>
                    <h3 className="up-ui-title">Send email to subscribers</h3>
                    {subscriptionsReady && !!subscriptionsLength ? (emailReady && emailExists) ? (
                        <p className="up-gray-400">An email about this post was sent to {thisEmail.recipients.length} subscriber{thisEmail.recipients.length > 1 ? "s" : ""} on {format(new Date(thisEmail.createdAt), "MMMM d, yyyy")}</p>
                    ) : (privacy === "public" || privacy === "unlisted") ? (
                        <p className="up-gray-400">Send to {subscriptions.subscriptions.length} subscriber{subscriptions.subscriptions.length > 1 ? "s" : ""} to the project "{props.getProjectLabel(projectId)}"</p>
                    ) : (
                        <p className="up-gray-400">Make this post public or unlisted to send it to subscribers.</p>
                    ) : (
                        <p className="up-gray-400">You have no subscribers to this project yet.</p>
                    )}
                </div>
            </div>

            <div className="flex mt-4">
                <SpinnerButton
                    isLoading={props.isEditLoading}
                    onClick={() => props.onSaveEdit(projectId, title, slateBody, privacy, tags, !!slateBody, !!["public", "unlisted"].includes(privacy) && sendEmail, backDate && date && new Date(date))}
                    isDisabled={!slateBody || !slateBody.length || slateBody.every(d => getIsEmpty(d)) || !title}
                >
                    {privacy === "draft" ? "Save draft" : props.title ? sendEmail ? "Save and send emails" : "Save" : sendEmail ? "Post and send emails" : "Post"}
                </SpinnerButton>
                <button className="up-button text" onClick={props.onCancelEdit} disabled={props.isEditLoading}>Cancel</button>
            </div>
        </>
    );
}