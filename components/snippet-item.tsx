import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, PostObj, ProjectObj, SnippetObj, SnippetObjGraph, UserObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";
import {FiArrowRightCircle, FiEdit2, FiTrash} from "react-icons/fi";
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
import EasyMDE from "easymde";
import {Node} from "slate";
import Linkify from "react-linkify";
import ProjectBrowser from "./project-browser";
import dynamic from "next/dynamic";
import SnippetItemInner from "./SnippetItemInner";
const SlateReadOnly = dynamic(() => import("./SlateReadOnly"));

export default function SnippetItem({snippet, iteration, setIteration, availableTags, addNewTags, setTagsQuery, selectedSnippetIds, setSelectedSnippetIds, setStatsIter, statsIter}: {
    snippet: DatedObj<SnippetObjGraph>,
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    availableTags: string[],
    addNewTags: (newTags: string[]) => void,
    setTagsQuery: (tagsQuery: string[]) => void,
    selectedSnippetIds: string[],
    setSelectedSnippetIds: Dispatch<SetStateAction<string[]>>,
    setStatsIter?: Dispatch<SetStateAction<number>>,
    statsIter?: number,
}) {
    const [session, loading] = useSession();
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isMove, setIsMove] = useState<boolean>(false);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [instance, setInstance] = useState<EasyMDE>(null);

    const isSelected = selectedSnippetIds.includes(snippet._id);

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
            if (setStatsIter && (statsIter !== undefined)) setStatsIter(statsIter + 1);
            setIteration(iteration + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelEdit(urlName: string) {
        setIsEdit(false);
        instance && instance.clearAutosavedValue();
        axios.post("/api/cancel-delete-images", {type: "snippet", id: snippet._id.toString()});
    }

    function onSaveEdit(urlName: string, isSnippet: boolean, body: string | Node[], url: string, tags: string[], isSlate?: boolean) {
        setIsEditLoading(true);

        axios.post("/api/snippet", {
            id: snippet._id,
            body: body || "",
            url: url || "",
            tags: tags || [],
            urlName: snippet.urlName,
            isSlate: !!isSlate,
        }).then(res => {
            if (res.data.newTags.length) addNewTags(res.data.newTags);
            instance && instance.clearAutosavedValue();
            setIteration(iteration + 1);
            setIsEdit(false);
        }).catch(e => {
            console.log(e);
            setIsEditLoading(false);
        });
    }

    function onMoveSnippet(selectedProjectId: string, setIsLoading: Dispatch<SetStateAction<boolean>>){
        setIsLoading(true);

        axios.post(`/api/snippet`, {id: snippet._id, projectId: selectedProjectId}).then(() => {
            setIsLoading(false);
            setIteration(iteration + 1);
            setStatsIter(statsIter + 1);
            setIsMove(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <>
            <div className={"py-8 border-b transition md:flex up-hover-parent " + (isSelected ? "" : "md:pr-8 md:-mr-8")}>
                {!isEdit && (
                    <div className="flex ml-auto mb-4 order-3">
                        <div className="md:hidden flex items-center">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setSelectedSnippetIds([...selectedSnippetIds, snippet._id]);
                                    } else {
                                        setSelectedSnippetIds(selectedSnippetIds.filter(d => d !== snippet._id));
                                    }
                                }}
                                disabled={isEdit}
                                className="mr-4 opacity-50 hover:opacity-100 w-4 h-4"
                            />
                            {!(session && session.userId === snippet.userId) && (
                                <Link href={`/@${snippet.authorArr[0].username}`}>
                                    <a>
                                        <img
                                            src={snippet.authorArr[0].image}
                                            alt={snippet.authorArr[0].name}
                                            className="w-6 h-6 rounded-full opacity-25 hover:opacity-100 transition mr-4"
                                        />
                                    </a>
                                </Link>
                            )}
                            <p className="opacity-25">
                                {format(new Date(snippet.createdAt), "h:mm a")}
                            </p>
                        </div>
                    </div>
                )}
                <div className="hidden md:block w-28 pr-4 mt-1 flex-shrink-0">
                    {!(session && session.userId === snippet.userId) && (
                        <Link href={`/@${snippet.authorArr[0].username}`}>
                            <a>
                                <img
                                    src={snippet.authorArr[0].image}
                                    alt={snippet.authorArr[0].name}
                                    className="w-6 h-6 rounded-full mb-4 opacity-25 hover:opacity-100 transition"
                                />
                            </a>
                        </Link>
                    )}
                    <p className="opacity-25">
                        {format(new Date(snippet.createdAt), "h:mm a")}
                    </p>
                    <div>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={e => {
                                if (e.target.checked) {
                                    setSelectedSnippetIds([...selectedSnippetIds, snippet._id]);
                                } else {
                                    setSelectedSnippetIds(selectedSnippetIds.filter(d => d !== snippet._id));
                                }
                            }}
                            disabled={isEdit}
                            className={`mt-4 w-5 h-5 opacity-25 hover:opacity-100 transition ` + (isSelected ? "" : "up-hover-child")}
                        />
                    </div>
                </div>
                <div className={`w-full relative ` + (isSelected ? "overflow-hidden" : "")} style={isSelected ? {
                    maxHeight: 90,
                    boxShadow: "rgb(255, 255, 255) 0px -40px 10px -10px inset",
                } : {}}>
                    <SnippetItemInner
                        snippet={snippet}
                        iteration={iteration}
                        setIteration={setIteration}
                        availableTags={availableTags}
                        addNewTags={addNewTags}
                        setTagsQuery={setTagsQuery}
                        isList={true}
                    />
                    {isSelected && (
                        <div className="w-full absolute top-0 left-0" style={{height: 90, boxShadow: "rgb(255, 255, 255) 0px -40px 20px -20px inset"}}/>
                    )}
                </div>
            </div>
        </>
    );
}