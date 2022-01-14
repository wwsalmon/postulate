import H1 from "../style/H1";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import {SlateReadOnly} from "../../slate/SlateEditor";
import {PublicNodePageProps} from "../../pages/[username]/[projectUrlName]/p/[urlName]";
import Badge from "../style/Badge";
import React from "react";

export default function EvergreenInner({pageUser, pageNode, pageProject, thisUser, small}: PublicNodePageProps & {small?: boolean}) {
    const {body: {title: privateTitle, body: privateBody, publishedTitle, publishedBody, publishedDate, lastPublishedDate}, createdAt, updatedAt} = pageNode;
    const isOwner = thisUser && pageNode.userId === thisUser._id;
    const isPublished = !!publishedTitle;
    const title = isPublished ? publishedTitle : privateTitle;
    const body = isPublished ? publishedBody : privateBody;
    const hasChanges = isOwner && isPublished && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);

    return (title && body) ? (
        <>
            <H1 small={true}>{title}</H1>
            <div className={`${(!isPublished || hasChanges) ? "sm:flex" : "flex"} items-center my-8 font-manrope text-gray-400 font-semibold w-full`}>
                <div className="flex items-center justify-between flex-grow mb-2 sm:mb-0 order-2">
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
                    {isOwner && (
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode._id}`}>Edit</MoreMenuItem>
                        </MoreMenu>
                    )}
                </div>
                <div className="flex items-center flex-wrap">
                    <span className="mr-4">{format(new Date(publishedDate || createdAt), "MMM d, yyyy")}</span>
                    {isPublished && publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    {!isPublished && createdAt !== updatedAt && (<span className="mr-4">Last updated {format(new Date(updatedAt), "MMM d, yyyy")}</span>)}
                </div>
            </div>
            <SlateReadOnly value={body} fontSize={small ? 18 : 20}/>
        </>
    ) : (
        <p>Invalid node</p>
    );
}