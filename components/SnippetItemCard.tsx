import {DatedObj, SnippetObjGraph} from "../utils/types";
import SlateReadOnly from "./SlateReadOnly";
import {format} from "date-fns";
import React, {Dispatch, SetStateAction, useState} from "react";
import {FiCheck, FiCheckCircle, FiGlobe, FiLink, FiLock} from "react-icons/fi";
import UpModal from "./up-modal";
import SnippetItemInner from "./SnippetItemInner";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";
import {useSession} from "next-auth/client";
import UpInlineButton from "./style/UpInlineButton";

export default function SnippetItemCard({snippet, setTagsQuery, iteration, setIteration, setStatsIter, statsIter, availableTags, addNewTags, selectedSnippetIds, setSelectedSnippetIds, showFullDate}: {
    snippet: DatedObj<SnippetObjGraph>,
    setTagsQuery: Dispatch<SetStateAction<string[]>>,
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    setStatsIter?: Dispatch<SetStateAction<number>>,
    statsIter?: number,
    availableTags: string[],
    addNewTags: (newTags: string[]) => void,
    selectedSnippetIds: string[],
    setSelectedSnippetIds: Dispatch<SetStateAction<string[]>>,
    showFullDate?: boolean,
}) {
    const [session, loading] = useSession();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const hasLinkedPosts = snippet.linkedPosts && !!snippet.linkedPosts.length;
    const hasTags = snippet.tags && !!snippet.tags.length;
    const isSelected = selectedSnippetIds.includes(snippet._id);

    return (
        <>
            <div
                className={`relative bg-white border ${isSelected ? "up-border-blue" : "up-border-gray-200 hover:up-border-gray-500"} rounded-lg p-4 h-52 hover:shadow-lg transition up-hover-parent`}
            >
                <button
                    className={"absolute top-2 left-2 w-8 h-8 rounded-full up-border-gray-300 border z-10 " + (isSelected ? "up-bg-blue text-white" : "up-hover-child bg-white hover:up-bg-gray-100 up-gray-300")}
                    onClick={() => setSelectedSnippetIds(isSelected ? selectedSnippetIds.filter(d => d !== snippet._id) : [...selectedSnippetIds, snippet._id])}
                >
                    <FiCheck className="mx-auto"/>
                </button>
                <button
                    className="h-36 overflow-hidden text-xs relative -mx-4 px-4 text-left block -mt-2"
                    style={{width: "calc(100% + 2rem)"}}
                    onClick={() => setModalOpen(true)}
                >
                    <SnippetItemLinkPreview snippet={snippet} small={true}/>
                    <div className="prose opacity-75 select-none w-full">
                        <SlateReadOnly nodes={snippet.slateBody}/>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full pointer-events-none" style={{
                        boxShadow: "rgb(255, 255, 255) 0px -40px 40px -10px inset",
                    }}/>
                </button>
                <div className="flex items-center mt-4 text-sm">
                    {session && session.userId !== snippet.userId && (
                        <img
                            src={snippet.authorArr[0].image}
                            alt={`Profile picture of ${snippet.authorArr[0].name}`}
                            className="w-6 h-6 rounded-full mr-4 opacity-75"
                        />
                    )}
                    <p className="up-gray-500">
                        {format(new Date(snippet.createdAt), showFullDate ? "MMMM d, yyyy 'at' h:mm a" : "h:mm a")}
                    </p>
                    <div className="ml-auto flex items-center">
                        <div className={hasLinkedPosts ? "mr-6" : ""}>
                            {snippet.privacy === "private" ? (
                                <FiLock className="up-gray-300"/>
                            ) : (
                                <FiGlobe/>
                            )}
                        </div>
                        {hasLinkedPosts && (
                            <>
                                <FiLink/>
                                <span className="ml-2">{snippet.linkedPosts.length}</span>
                            </>
                        )}
                    </div>
                    {hasTags && (
                        <div className={`flex items-center ml-2`}>
                            {snippet.tags.map(tag => (
                                <button className="up-gray-400 font-bold ml-2" onClick={() => setTagsQuery([tag])}>
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <UpModal isOpen={modalOpen} setIsOpen={setModalOpen} wide={true}>
                <div className="md:flex items-center py-4 bg-white">
                    <div className="mr-4" title={`Privacy: ${snippet.privacy}`}>
                        {snippet.privacy === "private" ? (
                            <FiLock className="up-gray-300"/>
                        ) : (
                            <FiGlobe/>
                        )}
                    </div>
                    <p className="up-gray-400">Posted on {format(new Date(snippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                    {hasTags && snippet.tags.map((tag, i) => (
                        <button
                            className={`up-gray-400 font-bold ${i === 0 ? "md:ml-auto" : "ml-2"}`}
                            onClick={() => setTagsQuery([tag])}
                        >
                            #{tag}
                        </button>
                    ))}
                    {session.userId !== snippet.userId && (
                        <>
                            <span className={`${hasTags ? "ml-6" : "ml-auto"} mr-2 up-gray-300`}>by</span>
                            <UpInlineButton href={`/@${snippet.authorArr[0].username}`}>
                                <div className="flex items-center">
                                    <img
                                        src={snippet.authorArr[0].image}
                                        alt={`Profile picture of ${snippet.authorArr[0].name}`}
                                        className="w-6 h-6 rounded-full mr-2 opacity-75"
                                    />
                                    <span>{snippet.authorArr[0].name}</span>
                                </div>
                            </UpInlineButton>
                        </>
                    )}
                </div>
                <div style={{maxHeight: "calc(100vh - 240px)", minHeight: 300, overflowY: "auto"}} className="-mx-4 px-4 relative">
                    <SnippetItemInner
                        snippet={snippet}
                        iteration={iteration}
                        setIteration={setIteration}
                        statsIter={statsIter}
                        setStatsIter={setStatsIter}
                        availableTags={availableTags}
                        addNewTags={addNewTags}
                        setTagsQuery={setTagsQuery}
                        setOpen={setModalOpen}
                    />
                </div>
            </UpModal>
        </>
    );
}