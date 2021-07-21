import {DatedObj, SnippetObjGraph} from "../utils/types";
import React, {Dispatch, ReactNode, SetStateAction} from "react";
import {FiExternalLink, FiGlobe, FiLock} from "react-icons/fi";
import Link from "next/link";
import {format} from "date-fns";
import UpInlineButton from "./style/UpInlineButton";
import {useSession} from "next-auth/client";

export default function SnippetModalShell({snippet, setTagsQuery, children}: {
    snippet: DatedObj<SnippetObjGraph>,
    setTagsQuery?: Dispatch<SetStateAction<string[]>>,
    children: ReactNode,
}) {
    const [session, loading] = useSession();
    const hasTags = snippet.tags && !!snippet.tags.length;

    return (
        <>
            <div className="md:flex items-center px-2 py-4 bg-white">
                <div className="mr-4" title={`Privacy: ${snippet.privacy}`}>
                    {snippet.privacy === "private" ? (
                        <FiLock className="up-gray-300"/>
                    ) : (
                        <Link href={`/@${snippet.authorArr[0].username}/s/${snippet._id}`}>
                            <a>
                                <FiGlobe/>
                            </a>
                        </Link>
                    )}
                </div>
                <p className="up-gray-400">Posted on {format(new Date(snippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                {hasTags && snippet.tags.map((tag, i) => (
                    <button
                        className={`up-gray-400 font-bold ${i === 0 ? "md:ml-auto" : "ml-2"}`}
                        onClick={() => setTagsQuery && setTagsQuery([tag])}
                    >
                        #{tag}
                    </button>
                ))}
                {session && (session.userId !== snippet.userId) && (
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
                {snippet.privacy === "public" && (
                    <UpInlineButton
                        href={`/@${snippet.authorArr[0].username}/s/${snippet._id}`}
                        className={"ml-auto"}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">Open as page</span>
                            <FiExternalLink/>
                        </div>
                    </UpInlineButton>
                )}
            </div>
            <div style={{maxHeight: "calc(100vh - 240px)", minHeight: 300, overflowY: "auto"}} className="-mx-4 px-6 pt-4 relative">
                {children}
            </div>
        </>
    );
}