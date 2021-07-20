import {DatedObj, SnippetObjGraph} from "../utils/types";
import SlateReadOnly from "./SlateReadOnly";
import {format} from "date-fns";
import React, {useState} from "react";
import {FiGlobe, FiLink, FiLock} from "react-icons/fi";
import UpModal from "./up-modal";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";
import {useSession} from "next-auth/client";
import UpInlineButton from "./style/UpInlineButton";
import Link from "next/link";

export default function SnippetItemCardReadOnly({snippet, showFullDate, showProject}: {
    snippet: DatedObj<SnippetObjGraph>,
    showFullDate?: boolean,
    showProject?: boolean,
}) {
    const [session, loading] = useSession();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const hasLinkedPosts = snippet.linkedPosts && !!snippet.linkedPosts.length;
    const hasTags = snippet.tags && !!snippet.tags.length;
    const isPublic = snippet.privacy === "public" || (session && session.userId === snippet.userId);

    return (
        <div
            className={`relative bg-white border up-border-gray-200 rounded-lg p-4 h-52 ${isPublic ? "hover:shadow-lg hover:up-border-gray-500" : ""} transition up-hover-parent`}
        >
            {isPublic ? (
                <>
                    {showProject && (
                        <div className="h-8 flex items-center">
                            <span className="mr-1 up-gray-400">In:</span>
                            <UpInlineButton
                                href={`/@${snippet.authorArr[0].username}/${snippet.projectArr[0].urlName}`}
                            >
                                {snippet.projectArr[0].name}
                            </UpInlineButton>
                        </div>
                    )}
                    <button
                        className={`${showProject ? "h-28" : "h-36"} overflow-hidden text-xs relative -mx-4 px-4 text-left block -mt-2`}
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
                        {session && (session.userId !== snippet.userId) && (
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
                            <div className={"up-gray-300 " + (hasLinkedPosts ? "mr-6" : "")}>
                                {snippet.privacy === "private" ? (
                                    <FiLock/>
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
                    </div>
                    <UpModal isOpen={modalOpen} setIsOpen={setModalOpen} wide={true}>
                        <div className="md:flex items-center py-4 bg-white">
                            <p className="up-gray-400">Posted on {format(new Date(snippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                            {hasTags && snippet.tags.map((tag, i) => (
                                <button
                                    className={`up-gray-400 font-bold ${i === 0 ? "md:ml-auto" : "ml-2"}`}
                                    onClick={() => null} // fix tag search later
                                >
                                    #{tag}
                                </button>
                            ))}
                            {session && (session.userId !== snippet.userId) && (
                                <>
                                    <span className="ml-auto mr-2 up-gray-300">by</span>
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
                            <div className="flex">
                                <div className="w-full" style={{minWidth: 0}}>
                                    {snippet.url && (
                                        <SnippetItemLinkPreview snippet={snippet}/>
                                    )}
                                    <div className={`content prose break-words`}>
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
                            </div>
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
                        </div>
                    </UpModal>
                </>
            ) : (
                <>
                    <div className="h-36 flex items-center up-gray-300 font-medium">
                        <FiLock/>
                        <p className="ml-2">Private snippet</p>
                    </div>
                    <p className="up-gray-500 mt-2">
                        {format(new Date(snippet.createdAt), showFullDate ? "MMMM d, yyyy 'at' h:mm a" : "h:mm a")}
                    </p>
                </>
            )}
        </div>
    );
}