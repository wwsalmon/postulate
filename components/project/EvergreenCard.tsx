import {PublicNodePageProps} from "../../pages/[username]/[projectUrlName]/p/[urlName]";
import Link from "next/link";
import getProjectUrl from "../../utils/getProjectUrl";
import Badge from "../style/Badge";
import {SlateReadOnly} from "../../slate/SlateEditor";
import {format} from "date-fns";
import React from "react";

export default function EvergreenCard({pageNode, pageProject, pageUser, thisUser}: PublicNodePageProps) {
    const isPublished = !!pageNode.body.publishedTitle;
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const hasChanges = isOwner && isPublished && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);

    return (
        <Link
            href={`${getProjectUrl(pageUser, pageProject)}/${isOwner ? pageNode._id : `/e/${pageNode.body.urlName}`}`}
        >
            <a className="p-4 border border-gray-300 rounded-md flex flex-col">
                <div>
                    <h3
                        className="font-manrope font-semibold mb-1"
                        key={pageNode._id}
                    >{(isOwner ? pageNode.body.title : pageNode.body.publishedTitle) || "Untitled post"}</h3>
                    {!isPublished && (
                        <Badge dark={true}>
                            <span>Unpublished draft</span>
                        </Badge>
                    )}
                    {hasChanges && (
                        <Badge>
                            <span>Unpublished changes</span>
                        </Badge>
                    )}
                    <div className="max-h-48 text-gray-500 truncate relative">
                        <SlateReadOnly
                            value={isPublished ? pageNode.body.publishedBody : pageNode.body.body}
                            fontSize={16}
                            className="text-gray-400"
                        />
                        <div className="w-full absolute top-40 left-0 h-8 bg-gradient-to-t from-white"></div>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-auto pt-4">
                    Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? pageNode.body.lastPublishedDate : pageNode.updatedAt), "MMM d, yyyy")}
                </p>
            </a>
        </Link>
    );
}