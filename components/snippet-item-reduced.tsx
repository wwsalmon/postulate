import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, SnippetObj, UserObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import {useSession} from "next-auth/client";
import Link from "next/link";
import {FiCode, FiEye} from "react-icons/fi";
import SimpleMDEEditor from "react-simplemde-editor";
import {simpleMDEToolbar} from "../utils/utils";

export default function SnippetItemReduced({snippet, authors, selectedSnippetIds = null, setSelectedSnippetIds = null, isPostPage = false}: {
    snippet: DatedObj<SnippetObj>,
    authors: DatedObj<UserObj>[],
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
                    <Link href={`/@${authors.find(d => d._id === snippet.userId).username}`}>
                        <a>
                            <img
                                src={authors.find(d => d._id === snippet.userId).image}
                                alt={authors.find(d => d._id === snippet.userId).name}
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
                    {!isPostPage && (
                        <button className="up-button text ml-auto opacity-50" onClick={() => setIsMarkdown(!isMarkdown)}>
                            {isMarkdown ? <FiEye/> : <FiCode/>}
                        </button>
                    )}
                </div>
            </div>
            {snippet.url && (
                <div className="p-2 rounded-md shadow-md mb-4 inline-block">
                    <span>{snippet.url}</span>
                </div>
            )}
            <div className="prose" style={{maxWidth: "unset"}}>
                {(!isMarkdown || isPostPage) ? (
                    Parser(markdownConverter.makeHtml(snippet.body))
                ) : (
                    <div className="border rounded-md bg-white p-2">
                        <SimpleMDEEditor
                            value={snippet.body}
                            onChange={() => null}
                            getMdeInstance={instance => {
                                instance.codemirror.setOption("readOnly", true);
                            }}
                            options={{
                                spellChecker: false,
                                toolbar: false,
                                status: false,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}