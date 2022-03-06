import Link from "next/link";
import getNodeUrl from "../../utils/getNodeUrl";
import {DatedObj, NodeObjPublic, ProjectObj, UserObj} from "../../utils/types";
import Badge from "../style/Badge";
import {isNodeEmpty} from "../../slate/withDeserializeMD";
import {getPlainTextFromSlateValue} from "../../slate/SlateEditor";
import React from "react";
import LinesEllipsis from "react-lines-ellipsis";

export default function ExploreNodeCard({pageUser, pageNode, pageProject, className}: {
    pageUser: DatedObj<UserObj>,
    pageNode: DatedObj<NodeObjPublic>,
    pageProject: DatedObj<ProjectObj>,
    className?: string,
}) {
    const previewText = (pageNode.type === "source" ? (
        pageNode.body.publishedSummary.every(d => isNodeEmpty(d)) ? (
            pageNode.body.publishedTakeaways.every(d => isNodeEmpty(d)) ? (
                getPlainTextFromSlateValue(pageNode.body.publishedNotes)
            ) : getPlainTextFromSlateValue(pageNode.body.publishedTakeaways)
        ) : getPlainTextFromSlateValue(pageNode.body.publishedSummary)
    ) : getPlainTextFromSlateValue(pageNode.body.publishedBody)) || "Empty note";

    return (
        <Link href={getNodeUrl(pageUser, pageProject, pageNode as NodeObjPublic)}>
            <a className={`p-4 border rounded-md block bg-white ${className || ""}`}>
                <div className="flex items-center">
                    <span className="mr-2 font-manrope font-semibold truncate">{pageNode.body.publishedTitle}</span>
                    <Badge className="flex-shrink-0">{pageNode.type.toUpperCase()}</Badge>
                </div>
                {pageNode.type === "source" && (
                    <LinesEllipsis
                        className="text-gray-400 mt-1 text-sm"
                        text={getPlainTextFromSlateValue(pageNode.body.sourceInfo)}
                        maxLine={1}
                    />
                )}
                <LinesEllipsis className="text-gray-500 mt-1 text-sm" text={previewText} maxLine={1}/>
            </a>
        </Link>
    );
}