import React from 'react';
import {DatedObj, SnippetObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";

export default function SnippetItemReduced({snippet}: { snippet: DatedObj<SnippetObj> }) {
    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    return (
        <div className="py-8 border-b hover:bg-gray-50 transition">
            <div className="opacity-25 mb-4">
                {format(new Date(snippet.createdAt), "h:mm a")}
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