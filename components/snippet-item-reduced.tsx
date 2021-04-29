import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, SnippetObjGraph} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import {useSession} from "next-auth/client";
import Link from "next/link";
import {FiCode, FiEye} from "react-icons/fi";
import SimpleMDEEditor from "react-simplemde-editor";
import SlateReadOnly from "./SlateReadOnly";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";

export default function SnippetItemReduced({snippet, selectedSnippetIds = null, setSelectedSnippetIds = null, isPostPage = false}: {
    snippet: DatedObj<SnippetObjGraph>,
    selectedSnippetIds?: string[],
    setSelectedSnippetIds?: Dispatch<SetStateAction<string[]>>,
    isPostPage?: boolean,
}) {
    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });
    const [session, loading] = useSession();
    const [isMarkdown, setIsMarkdown] = useState<boolean>(false);

    const isSelected = selectedSnippetIds ? selectedSnippetIds.includes(snippet._id) : null;

    return (
        <div className={`py-8 border-b hover:bg-gray-50 transition ${isPostPage ? "" : "px-4 -mx-4"}`}>
            <div className="flex items-center mb-4">
                {!(session && session.userId === snippet.userId) && (
                    <Link href={`/@${snippet.authorArr[0].username}`}>
                        <a>
                            <img
                                src={snippet.authorArr[0].image}
                                alt={snippet.authorArr[0].name}
                                className="w-6 h-6 rounded-full opacity-25 hover:opacity-100 transition mr-4 "
                            />
                        </a>
                    </Link>
                )}
                <div className="flex items-center w-full">
                    {selectedSnippetIds && setSelectedSnippetIds && (
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
                            className="mr-4 opacity-50 hover:opacity-100 w-4 h-4"
                        />
                    )}
                    <div className="opacity-25">
                        {format(new Date(snippet.createdAt), "h:mm a")}
                    </div>
                    {!isPostPage && !snippet.slateBody && (
                        <button className="up-button text ml-auto opacity-50" onClick={() => setIsMarkdown(!isMarkdown)}>
                            {isMarkdown ? <FiEye/> : <FiCode/>}
                        </button>
                    )}
                </div>
            </div>
            {snippet.url && (
                <SnippetItemLinkPreview snippet={snippet}/>
            )}
            <div className="prose" style={{maxWidth: "unset"}}>
                <SlateReadOnly nodes={snippet.slateBody}/>
            </div>
        </div>
    );
}