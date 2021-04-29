import {DatedObj, SnippetObjGraph} from "../utils/types";
import SlateReadOnly from "./SlateReadOnly";
import {format} from "date-fns";
import React, {Dispatch, SetStateAction, useState} from "react";
import {FiLink} from "react-icons/fi";
import UpModal from "./up-modal";
import SnippetItemInner from "./SnippetItemInner";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";

export default function SnippetItemCard({snippet, setTagsQuery, iteration, setIteration, setStatsIter, statsIter, availableTags, addNewTags}: {
    snippet: DatedObj<SnippetObjGraph>,
    setTagsQuery: Dispatch<SetStateAction<string[]>>,
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    setStatsIter?: Dispatch<SetStateAction<number>>,
    statsIter?: number,
    availableTags: string[],
    addNewTags: (newTags: string[]) => void,
}) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const hasLinkedPosts = snippet.linkedPosts && !!snippet.linkedPosts.length;
    const hasTags = snippet.tags && !!snippet.tags.length;

    return (
        <>
            <button
                className="bg-white border up-border-gray-200 rounded-lg p-4 h-52 hover:shadow-lg hover:up-border-gray-500 transition text-left"
                onClick={() => setModalOpen(true)}
            >
                <div className="h-32 overflow-hidden text-xs relative">
                    <SnippetItemLinkPreview snippet={snippet} small={true}/>
                    <div className="prose opacity-75 select-none w-full">
                        <SlateReadOnly nodes={snippet.slateBody}/>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full pointer-events-none" style={{
                        boxShadow: "rgb(255, 255, 255) 0px -40px 40px -10px inset",
                    }}/>
                </div>
                <div className="flex items-center mt-6 text-sm">
                    <p className="up-gray-500">
                        {format(new Date(snippet.createdAt), "h:mm a")}
                    </p>
                    {hasLinkedPosts && (
                        <div className="ml-auto flex items-center">
                            <FiLink/>
                            <span className="ml-2">{snippet.linkedPosts.length}</span>
                        </div>
                    )}
                    {hasTags && (
                        <div className={`flex items-center ${hasLinkedPosts ? "" : "ml-auto"}`}>
                            {snippet.tags.map(tag => (
                                <button className="up-gray-400 font-bold ml-2" onClick={() => setTagsQuery([tag])}>
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </button>
            <UpModal isOpen={modalOpen} setIsOpen={setModalOpen} wide={true}>
                <div className="md:flex items-center py-4 bg-white">
                    <p className="up-gray-400">Posted on {format(new Date(snippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                    {snippet.tags.map((tag, i) => (
                        <button
                            className={`up-gray-400 font-bold ${i === 0 ? "md:ml-auto" : "ml-2"}`}
                            onClick={() => setTagsQuery([tag])}
                        >
                            #{tag}
                        </button>
                    ))}
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
                    />
                </div>
            </UpModal>
        </>
    );
}