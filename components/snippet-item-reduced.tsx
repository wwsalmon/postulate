import React from 'react';
import {DatedObj, SnippetObj, UserObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import {useSession} from "next-auth/client";
import Link from "next/link";

export default function SnippetItemReduced({snippet, authors}: { snippet: DatedObj<SnippetObj>, authors: DatedObj<UserObj>[] }) {
    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });
    const [session, loading] = useSession();

    return (
        <div className="py-8 border-b hover:bg-gray-50 transition px-4 -ml-4">
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
                <div className="opacity-25">
                    {format(new Date(snippet.createdAt), "h:mm a")}
                </div>
            </div>
            {snippet.url && (
                <div className="p-2 rounded-md shadow-md mb-4 inline-block">
                    <span>{snippet.url}</span>
                </div>
            )}
            <div className="prose">
                {Parser(markdownConverter.makeHtml(snippet.body))}
            </div>
        </div>
    );
}