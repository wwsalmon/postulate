import Link from "next/link";
import getNodeUrl from "../../utils/getNodeUrl";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../utils/types";
import Badge from "../style/Badge";
import {isNodeEmpty} from "../../slate/withDeserializeMD";
import {getPlainTextFromSlateValue} from "../../slate/SlateEditor";
import React from "react";
import {format} from "date-fns";

export default function ExploreNodeCard({pageUser, pageNode, pageProject, className, isSearch, isProjectPage}: {
    pageUser: DatedObj<UserObj>,
    pageNode: DatedObj<NodeObj>,
    pageProject: DatedObj<ProjectObj>,
    isSearch?: boolean,
    isProjectPage?: boolean,
    className?: string,
}) {
    let previewText;

    if (pageNode.type === "source") {
        const summary = "urlName" in pageNode.body ? pageNode.body.publishedSummary : pageNode.body.summary;
        const takeaways = "urlName" in pageNode.body ? pageNode.body.publishedTakeaways : pageNode.body.takeaways;
        const notes = "urlName" in pageNode.body ? pageNode.body.publishedNotes : pageNode.body.notes;
        const sourceInfo = "urlName" in pageNode.body ? pageNode.body.publishedSourceInfo : pageNode.body.sourceInfo;

        previewText = summary.every(d => isNodeEmpty(d)) ? (
            takeaways.every(d => isNodeEmpty(d)) ? (
                getPlainTextFromSlateValue(notes)
            ) : getPlainTextFromSlateValue(takeaways)
        ) : getPlainTextFromSlateValue(summary);
    } else {
        previewText = getPlainTextFromSlateValue("urlName" in pageNode.body ? pageNode.body.publishedBody : pageNode.body.body);
    }

    previewText = previewText || "Empty note";

    const title = "urlName" in pageNode.body ? pageNode.body.publishedTitle : pageNode.body.title;

    return (
        <Link href={getNodeUrl(pageUser, pageProject, pageNode)}>
            <a className={`${isSearch ? "" : "sm:p-6"} p-4 border rounded-md block bg-white hover:bg-gray-50 transition ${className || ""}`}>
                <div className="flex items-center">
                    <span className={`mr-2 font-manrope font-semibold truncate ${isSearch ? "" : "sm:text-xl"}`}>{title}</span>
                    <Badge className="flex-shrink-0 ml-auto">{pageNode.type.toUpperCase()}</Badge>
                </div>
                {isSearch ? (
                    <p className="text-gray-400">{isProjectPage && `${pageProject.name}. `}{format(new Date(pageNode.createdAt), "MMM d, yyyy")} {!("urlName" in pageNode.body) && "(Unpublished)"}</p>
                ) : (
                    <>
                        {pageNode.type === "source" && (
                            <p className="my-2 text-gray-400 text-sm line-clamp-1">
                                {getPlainTextFromSlateValue(pageNode.body.sourceInfo)}
                            </p>
                        )}
                        <p className="mt-2 text-gray-500 text-sm sm:text-base line-clamp-2">
                            {previewText}
                        </p>
                    </>
                )}
            </a>
        </Link>
    );
}