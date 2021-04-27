import {DatedObj, SnippetObj} from "../utils/types";
import SlateReadOnly from "./SlateReadOnly";
import {format} from "date-fns";
import React, {Dispatch, SetStateAction, useState} from "react";
import {FiLink} from "react-icons/fi";
import UpModal from "./up-modal";

export default function SnippetItemCard({snippet, setTagQuery}: { snippet: DatedObj<SnippetObj>, setTagQuery: Dispatch<SetStateAction<string[]>> }) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const hasLinkedPosts = snippet.linkedPosts && !!snippet.linkedPosts.length;
    const hasTags = snippet.tags && !!snippet.tags.length;

    return (
        <div className="bg-white border up-border-gray-200 rounded-lg p-4 h-64 hover:shadow-lg hover:up-border-gray-500 transition">
            <div className="h-44 overflow-hidden">
                <button className="relative prose text-xs opacity-75 select-none h-full text-left" onClick={() => setModalOpen(true)}>
                    <SlateReadOnly nodes={snippet.slateBody}/>
                    <div className="absolute top-0 left-0 h-full w-full" style={{
                        boxShadow: "rgb(255, 255, 255) 0px -40px 40px -10px inset",
                    }}/>
                </button>
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
                            <button className="up-gray-400 font-bold ml-2" onClick={() => setTagQuery([tag])}>
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <UpModal isOpen={modalOpen} setIsOpen={setModalOpen} wide={true}>
                <div style={{maxHeight: "calc(100vh - 200px)", overflowY: "auto"}} className="-mx-4 px-4 modal-editor">
                    <div className="prose content">
                        <SlateReadOnly nodes={snippet.slateBody}/>
                    </div>
                </div>
            </UpModal>
        </div>
    );
}