import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, SnippetObj, UserObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";
import {FiEdit2, FiTrash} from "react-icons/fi";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import SpinnerButton from "./spinner-button";
import axios from "axios";
import UpModal from "./up-modal";
import "easymde/dist/easymde.min.css";
import {useSession} from "next-auth/client";
import Link from "next/link";
import {fetcher} from "../utils/utils";
import useSWR from "swr";
import SnippetEditor from "./snippet-editor";

export default function SnippetItem({snippet, authors, iteration, setIteration, availableTags, addNewTags, setTagsQuery}: {
    snippet: DatedObj<SnippetObj>,
    authors: DatedObj<UserObj>[],
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    availableTags: string[],
    addNewTags: (newTags: string[]) => void,
    setTagsQuery: (tagsQuery: string[]) => void,
}) {
    const [session, loading] = useSession();
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const {data: linkPreview, error: linkPreviewError} = useSWR(`/api/link-preview?url=${snippet.url}`, snippet.url ? fetcher : () => null);

    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    function onDelete() {
        setIsLoading(true);

        axios.delete("/api/snippet", {
            data: {
                id: snippet._id.toString(),
            }
        }).then(() => {
            setIsLoading(false);
            setIsDeleteOpen(false);
            setIteration(iteration + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelEdit(urlName: string) {
        setIsEdit(false);
        axios.post("/api/cancel-delete-images", {type: "snippet", id: snippet._id.toString()});
    }

    function onSaveEdit(urlName: string, isSnippet: boolean, body: string, url: string, tags: string[]) {
        setIsEditLoading(true);

        axios.post("/api/snippet", {
            id: snippet._id,
            body: body || "",
            url: url || "",
            tags: tags || [],
            urlName: snippet.urlName,
        }).then(res => {
            if (res.data.newTags.length) addNewTags(res.data.newTags);
            setIteration(iteration + 1);
            setIsEdit(false);
        }).catch(e => {
            console.log(e);
            setIsEditLoading(false);
        });
    }

    return (
        <>
            <div className={"py-8 border-b transition md:flex" + (isEdit ? "" : " hover:bg-gray-50")}>
                {!isEdit && (
                    <div className="flex ml-auto mb-4 order-3">
                        <div className="md:hidden flex items-center">
                            {!(session && session.userId === snippet.userId) && (
                                <Link href={`/@${authors.find(d => d._id === snippet.userId).username}`}>
                                    <a>
                                        <img
                                            src={authors.find(d => d._id === snippet.userId).image}
                                            alt={authors.find(d => d._id === snippet.userId).name}
                                            className="w-6 h-6 rounded-full opacity-25 hover:opacity-100 transition mr-4"
                                        />
                                    </a>
                                </Link>
                            )}
                            <p className="opacity-25">
                                {format(new Date(snippet.createdAt), "h:mm a")}
                            </p>
                        </div>
                        {session && (session.userId === snippet.userId) && (
                            <div className="ml-auto">
                                <MoreMenu>
                                    <MoreMenuItem text="Edit" icon={<FiEdit2/>} onClick={() => setIsEdit(true)}/>
                                    <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
                                </MoreMenu>
                                <UpModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}>
                                    <p>Are you sure you want to delete this snippet? This cannot be undone.</p>
                                    <div className="flex mt-4">
                                        <SpinnerButton isLoading={isLoading} onClick={onDelete}>
                                            Delete
                                        </SpinnerButton>
                                        <button className="up-button text" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                                    </div>
                                </UpModal>
                            </div>
                        )}
                    </div>
                )}
                <div className="hidden md:block w-32 mt-1 flex-shrink-0">
                    {!(session && session.userId === snippet.userId) && (
                        <Link href={`/@${authors.find(d => d._id === snippet.userId).username}`}>
                            <a>
                                <img
                                    src={authors.find(d => d._id === snippet.userId).image}
                                    alt={authors.find(d => d._id === snippet.userId).name}
                                    className="w-6 h-6 rounded-full mb-4 opacity-25 hover:opacity-100 transition"
                                />
                            </a>
                        </Link>
                    )}
                    <p className="opacity-25">
                        {format(new Date(snippet.createdAt), "h:mm a")}
                    </p>
                </div>
                <div className="w-full">
                    {(isEdit && session && session.userId === snippet.userId) ? (
                        <SnippetEditor
                            snippet={snippet}
                            availableTags={availableTags}
                            isLoading={isEditLoading}
                            onSaveEdit={onSaveEdit}
                            onCancelEdit={onCancelEdit}
                        />
                    ) : (
                        <>
                            {snippet.url && (
                                <Link href={snippet.url}>
                                    <a className="p-4 rounded-md shadow-md mb-8 flex opacity-50 hover:opacity-100 transition">
                                        <div>
                                            <p className="underline opacity-50 break-all">{snippet.url}</p>
                                            {linkPreview && (
                                                <div className="mt-4">
                                                    <p className="up-ui-item-title">{linkPreview.title}</p>
                                                    <p>{linkPreview.description}</p>
                                                </div>
                                            )}
                                        </div>
                                        {linkPreview && linkPreview.images && linkPreview.images.length && (
                                            <div className="w-32 ml-auto pl-4 flex-shrink-0">
                                                <img src={linkPreview.images[0]} className="w-full"/>
                                            </div>
                                        )}
                                    </a>
                                </Link>
                            )}
                            <div className="content prose">
                                {Parser(markdownConverter.makeHtml(snippet.body))}
                            </div>
                            <div className="flex mt-4">
                                {snippet.tags && snippet.tags.map(tag => (
                                    <button
                                        className="font-bold opacity-50 mr-2"
                                        onClick={() => setTagsQuery([tag])}
                                    >#{tag}</button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}