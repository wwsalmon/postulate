import Link from "next/link";
import getNodeUrl from "../../utils/getNodeUrl";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../utils/types";
import Badge from "../style/Badge";
import {isNodeEmpty} from "../../slate/withDeserializeMD";
import {getPlainTextFromSlateValue} from "../../slate/SlateEditor";
import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import {format} from "date-fns";

export default function ExploreNodeCard({pageUser, pageNode, pageProject, className, isSearch}: {
    pageUser: DatedObj<UserObj>,
    pageNode: DatedObj<NodeObj>,
    pageProject: DatedObj<ProjectObj>,
    isSearch?: boolean,
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
            <a className={`${isSearch ? "" : "sm:p-6"} p-4 border rounded-md block bg-white ${className || ""}`}>
                <div className="flex items-center">
                    <span className={`mr-2 font-manrope font-semibold truncate ${isSearch ? "" : "sm:text-xl"}`}>{title}</span>
                    <Badge className="flex-shrink-0 ml-auto">{pageNode.type.toUpperCase()}</Badge>
                </div>
                {isSearch ? (
                    <p className="text-gray-400">{pageProject.name}. {format(new Date(pageNode.createdAt), "MMM d, yyyy")} {!("urlName" in pageNode.body) && "(Unpublished)"}</p>
                ) : (
                    <>
                        {pageNode.type === "source" && (
                            <LinesEllipsis
                                className="text-gray-400 my-2 text-sm"
                                text={getPlainTextFromSlateValue(pageNode.body.sourceInfo)}
                                maxLine={1}
                            />
                        )}
                        <LinesEllipsis className="text-gray-500 mt-2 text-sm sm:text-base" text={previewText} maxLine={2}/>
                    </>
                )}
            </a>
        </Link>
    );
}