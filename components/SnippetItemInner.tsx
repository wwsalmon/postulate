import {DatedObj, SnippetObjGraph} from "../utils/types";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {Node} from "slate";
import {useSession} from "next-auth/client";
import SlateReadOnly from "./SlateReadOnly";
import SnippetEditor from "./snippet-editor";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";
import {FiArrowRightCircle, FiEdit2, FiGlobe, FiLock, FiTrash} from "react-icons/fi";
import UpModal from "./up-modal";
import SpinnerButton from "./spinner-button";
import ProjectBrowser from "./project-browser";
import Link from "next/link";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";
import Mousetrap from "mousetrap";

export default function SnippetItemInner({snippet, iteration, setIteration, setStatsIter, statsIter, availableTags, addNewTags, isList, setTagsQuery, setOpen}: {
    snippet: DatedObj<SnippetObjGraph>,
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    setStatsIter?: Dispatch<SetStateAction<number>>,
    statsIter?: number,
    availableTags: string[],
    addNewTags: (newTags: string[]) => void,
    setTagsQuery: (tagsQuery: string[]) => void,
    isList?: boolean,
    setOpen?: Dispatch<SetStateAction<boolean>>,
}) {
    const [session, loading] = useSession();
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isMove, setIsMove] = useState<boolean>(false);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [isPrivacyLoading, setIsPrivacyLoading] = useState<boolean>(false);

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
            if (setOpen) setOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelEdit(urlName: string) {
        setIsEdit(false);
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
            if (setOpen) setOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onTogglePrivacy() {
        setIsPrivacyLoading(true);

        axios.post("/api/snippet", {
            id: snippet._id,
            privacy: snippet.privacy === "public" ? "private" : "public",
        }).then(() => {
            setIteration(iteration + 1);
            setIsPrivacyLoading(false);
            if (setOpen) setOpen(false);
        }).catch(e => {
            setIsPrivacyLoading(false);
            console.log(e);
        });
    }
    
    useEffect(() => {
        function onEditShortcut(e) {
            e.preventDefault();
            setIsEdit(true);
        }

        function onMoveShortcut(e) {
            e.preventDefault();
            setIsMove(true);
        }

        Mousetrap.bind("e", onEditShortcut);

        Mousetrap.bind("m", onMoveShortcut);

        return () => {
            Mousetrap.unbind("e", onEditShortcut);
            Mousetrap.unbind("m", onMoveShortcut);
        };          
    }, []);

    const ThisMoreMenu = () => (
        <div className="ml-auto">
            <MoreMenu>
                <MoreMenuItem text="Edit (e)" icon={<FiEdit2/>} onClick={() => setIsEdit(true)}/>
                <MoreMenuItem text="Move (m)" icon={<FiArrowRightCircle/>} onClick={() => setIsMove(true)}/>
                <MoreMenuItem
                    text={isPrivacyLoading ? "Loading..." : `Make ${snippet.privacy === "public" ? "private" : "public"}`}
                    icon={snippet.privacy === "public" ? <FiLock/> : <FiGlobe/>}
                    onClick={onTogglePrivacy}
                    disabled={isPrivacyLoading}
                />
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
            <UpModal isOpen={isMove} setIsOpen={setIsMove} wide={true}>
                <h3 className="up-ui-title mb-4">Select a project to move this snippet to</h3>
                <ProjectBrowser
                    setOpen={setIsMove}
                    featuredProjectIds={[snippet.projectId]}
                    buttonText="Move"
                    onSubmit={onMoveSnippet}
                />
            </UpModal>
        </div>
    )

    return (
        <>
            {(isEdit && session && session.userId === snippet.userId) ? (
                <>
                    <h3 className="up-ui-item-title mb-8">Editing snippet</h3>
                    <SnippetEditor
                        snippet={snippet}
                        availableTags={availableTags}
                        isLoading={isEditLoading}
                        onSaveEdit={onSaveEdit}
                        onCancelEdit={onCancelEdit}
                        setInstance={() => null}
                    />
                </>
            ) : (
                <>
                    <div className="flex">
                        <div className="w-full" style={{minWidth: 0}}>
                            {snippet.url && (
                                <SnippetItemLinkPreview snippet={snippet}/>
                            )}
                            <div className={`${isList ? "" : "content"} prose break-words`}>
                                <SlateReadOnly nodes={snippet.slateBody}/>
                            </div>
                            {!!snippet.linkArr.length && (
                                <>
                                    <hr className="mb-8 mt-4"/>
                                    <p className="up-ui-title">Linked resources ({snippet.linkArr.length}):</p>
                                    {snippet.linkArr.map(d => (
                                        <div className="my-2">
                                            <SnippetItemLinkPreview url={d.targetUrl}/>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        {session && session.userId === snippet.userId && (
                            <ThisMoreMenu/>
                        )}
                    </div>
                    {isList && (
                        <div className="flex mt-4">
                            {snippet.tags && snippet.tags.map(tag => (
                                <button
                                    className="font-bold opacity-50 mr-2"
                                    onClick={() => setTagsQuery([tag])}
                                >#{tag}</button>
                            ))}
                        </div>
                    )}
                    {!!snippet.linkedPosts.length && (
                        <div className="opacity-50 hover:opacity-100 transition pb-8">
                            <hr className="mb-8 mt-4"/>
                            <p className="up-ui-title">Linked posts ({snippet.linkedPosts.length}):</p>
                            {snippet.linkedPostsArr.map(d => (
                                <Link href={`/@${snippet.authorArr[0].username}/p/${d.urlName}`}>
                                    <a className="underline my-2 block">
                                        {d.title}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    )
}