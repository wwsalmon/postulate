import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import {findImages} from "../../slate/withImages";
import Link from "next/link";
import getProjectUrl from "../../utils/getProjectUrl";
import Badge from "../style/Badge";
import {format} from "date-fns";
import slateWordCount from "../../slate/slateWordCount";
import {ExternalBadge} from "./NodeCard";
import React from "react";

export default function PostItem({pageNode, pageProject, pageUser, thisUser, className, isSidebar}: PublicNodePageProps & {className?: string, isSidebar?: boolean}) {
    if (pageNode.type !== "post") return <></>;
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const isPublished = "publishedTitle" in pageNode.body;
    const hasChanges = isOwner && "publishedTitle" in pageNode.body && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);
    const isExternal = !!pageNode.shortcutArr;
    const images = findImages("publishedTitle" in pageNode.body ? pageNode.body.publishedBody : pageNode.body.body);
    const firstImage = images[0];

    return (
        <Link
            href={`${getProjectUrl(pageUser, pageProject)}/${("urlName" in pageNode.body && (isExternal || !isOwner)) ? `p/${pageNode.body.urlName}` : pageNode._id}`}
        >
            <a className={`mb-8 flex items-center ${className || ""}`}>
                <div className="flex-grow">
                    <h3
                        className={`font-manrope font-semibold mb-2 md:mb-0 ${isSidebar ? "text-sm" : ""}`}
                        key={pageNode._id}
                    >{(("urlName" in pageNode.body && !isOwner) ? pageNode.body.publishedTitle : pageNode.body.title) || `Untitled post`}</h3>
                    <div className={`flex items-center flex-wrap text-gray-400 ${isSidebar ? "text-xs" : "text-sm"}`}>
                        {!isPublished && (isSidebar ? (
                            <p className="mr-3 mt-2">Unpublished draft</p>
                        ) : (
                            <Badge dark={true} className="mr-3 mt-2">
                                <span>Unpublished draft</span>
                            </Badge>
                        ))}
                        {isSidebar && (
                            <p className="mr-3 mt-2">
                                {format(new Date("urlName" in pageNode.body ? pageNode.body.publishedDate : pageNode.createdAt), "MMM d, yyyy")}
                            </p>
                        )}
                        {!isSidebar && (
                            <>
                                <p className="mr-3 mt-2">
                                    Last {isPublished ? "Last published" : "Last updated"} {format(new Date("urlName" in pageNode.body ? pageNode.body.lastPublishedDate : pageNode.updatedAt), "MMM d, yyyy")}
                                </p>
                                <p className="mr-3 mt-2">
                                    {Math.ceil(slateWordCount(("urlName" in pageNode.body && !isOwner) ? pageNode.body.publishedBody : pageNode.body.body) / 200)} min read
                                </p>
                            </>
                        )}
                        {hasChanges && (isSidebar ? (
                            <p className="mr-3 mt-2">Unpublished changes</p>
                        ) : (
                            <Badge className="mr-3 mt-2">
                                Unpublished changes
                            </Badge>
                        ))}
                        {isExternal && (
                            <ExternalBadge className="mt-2"/>
                        )}
                    </div>
                </div>
                {firstImage && (
                    <img src={firstImage} className={`${isSidebar ? "w-16 h-12" : "w-24 h-20"} object-cover ml-4 flex-shrink-0`}/>
                )}
            </a>
        </Link>
    );
}