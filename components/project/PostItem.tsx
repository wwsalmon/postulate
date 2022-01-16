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
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const isPublished = !!pageNode.body.publishedTitle;
    const hasChanges = isOwner && isPublished && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);
    const isExternal = !!pageNode.shortcutArr;
    const images = findImages(pageNode.body.publishedBody || pageNode.body.body);
    const firstImage = images[0];

    return (
        <Link
            href={`${getProjectUrl(pageUser, pageProject)}/${(isOwner && !isExternal && !isPublished) ? pageNode._id : `/p/${pageNode.body.urlName}`}`}
        >
            <a className={`block mb-8 flex items-center ${className || ""}`}>
                <div className="flex-grow">
                    <h3
                        className="font-manrope font-semibold mb-2 md:mb-0"
                        key={pageNode._id}
                    >{(isOwner ? pageNode.body.title : pageNode.body.publishedTitle) || `Untitled post`}</h3>
                    <div className="flex items-center flex-wrap text-gray-400 text-sm">
                        {!isPublished && (
                            <Badge dark={true} className="mr-3 mt-2">
                                <span>Unpublished draft</span>
                            </Badge>
                        )}
                        <p className="mr-3 mt-2">
                            Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? pageNode.body.lastPublishedDate : pageNode.updatedAt), "MMM d, yyyy")}
                        </p>
                        <p className="mr-3 mt-2">{Math.ceil(slateWordCount(isOwner ? pageNode.body.body : pageNode.body.publishedBody) / 200)} min read</p>
                        {hasChanges && (
                            <Badge className="mr-3 mt-2">
                                Unpublished changes
                            </Badge>
                        )}
                        {isExternal && (
                            <ExternalBadge className="mt-2"/>
                        )}
                    </div>
                </div>
                {firstImage && (
                    <img src={firstImage} className="w-24 h-20 object-cover ml-4 flex-shrink-0"/>
                )}
            </a>
        </Link>
    );
}