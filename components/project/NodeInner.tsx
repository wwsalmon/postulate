import H1 from "../style/H1";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import {SlateReadOnly} from "../../slate/SlateEditor";
import Badge from "../style/Badge";
import React from "react";
import {getIsNodeUpdated} from "../../pages/[username]/[projectUrlName]/[id]";
import UiH3 from "../style/UiH3";
import {isNodeEmpty} from "../../slate/withDeserializeMD";
import UserButton from "../standard/UserButton";
import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import InlineButton from "../style/InlineButton";
import {FiExternalLink} from "react-icons/fi";
import Banner from "../style/Banner";

export default function NodeInner({pageUser, pageNode, pageProject, thisUser, modal}: PublicNodePageProps & {modal?: boolean}) {
    const {
        body: {
            title: privateTitle,
            body: privateBody,
            notes: privateNotes,
            summary: privateSummary,
            takeaways: privateTakeaways,
            link: privateLink,
            publishedTitle,
            publishedBody,
            publishedNotes,
            publishedSummary,
            publishedTakeaways,
            publishedLink,
            publishedDate,
            lastPublishedDate
        },
        createdAt,
        updatedAt
    } = pageNode;
    const isSource = pageNode.type === "source";
    const isOwner = thisUser && pageNode.userId === thisUser._id;
    const isPublished = !!publishedTitle;
    const isExternal = !!pageNode.shortcutArr;
    const originalProject = isExternal && pageNode.orrProjectArr[0];
    const title = publishedTitle || privateTitle;
    const body = publishedBody || privateBody;
    const notes = publishedNotes || privateNotes;
    const summary = publishedSummary || privateSummary;
    const takeaways = publishedTakeaways || privateTakeaways;
    const link = publishedLink || privateLink;
    const isUpdated = isOwner && getIsNodeUpdated(pageNode);

    const hasSummaryOrTakeaways = isSource && [summary, takeaways].some(d => !d.every(x => isNodeEmpty(x)));

    return (title && (body || (notes && summary && takeaways && link !== undefined))) ? (
        <>
            {isSource && (<UiH3 className="mb-2">Source notes</UiH3>)}
            <H1 small={true}>{title}</H1>
            {isSource && link && (<a className="text-gray-400 my-4 truncate underline block" href={link}>{link}</a>)}
            {isExternal && (
                <Banner className="my-6">
                    <FiExternalLink/>
                    <div className="ml-4">
                        <span className="mr-2">This is a shortcut to the {pageNode.type} originally posted in </span>
                        <InlineButton className="-my-[11px]" href={getProjectUrl(pageUser, originalProject)}>{originalProject.name}</InlineButton><br/>
                        <span className="mr-2">See the original </span>
                        <InlineButton className="-my-[11px]" href={`${getProjectUrl(pageUser, originalProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                            here
                        </InlineButton>
                    </div>
                </Banner>
            )}
            <div className={`${(!isPublished || isUpdated) ? "sm:flex" : "flex"} items-center ${isSource ? "mb-8" : "my-8"} font-manrope text-gray-400 font-semibold w-full`}>
                <div className="flex items-center justify-between flex-grow mb-2 sm:mb-0 order-2">
                    {!isPublished && (
                        <Badge dark={true}>
                            <span>Unpublished draft</span>
                        </Badge>
                    )}
                    {isUpdated && (
                        <Badge>
                            <span>Unpublished changes</span>
                        </Badge>
                    )}
                    {isOwner && (
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            <MoreMenuItem href={`${getProjectUrl(pageUser, originalProject || pageProject)}/${pageNode._id}`}>
                                {`Edit${isExternal ? " in original project" : ""}`}
                            </MoreMenuItem>
                            {modal && isPublished && (
                                <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                    View as page
                                </MoreMenuItem>
                            )}
                            {isExternal && (
                                <MoreMenuItem href={`${getProjectUrl(pageUser, originalProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                    View in original project
                                </MoreMenuItem>
                            )}
                        </MoreMenu>
                    )}
                </div>
                <div className="flex items-center flex-wrap">
                    <span className="mr-4">{format(new Date(publishedDate || createdAt), "MMM d, yyyy")}</span>
                    {isPublished && publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    {!isPublished && createdAt !== updatedAt && (<span className="mr-4">Last updated {format(new Date(updatedAt), "MMM d, yyyy")}</span>)}
                </div>
            </div>
            {!modal && (
                <UserButton user={pageUser} className="mb-8"/>
            )}
            {isSource ? (
                <>
                    {hasSummaryOrTakeaways && (
                        <div className="p-6 border border-gray-300 rounded-md mb-16 shadow-lg">
                            {
                                ["summary", "takeaways"]
                                    .filter(field => !eval(field).every(node => isNodeEmpty(node)))
                                    .map((field, i) => (
                                        <React.Fragment key={field}>
                                            {i !== 0 && (<hr className="my-6 -mx-6"/>)}
                                            <UiH3 className="mb-2">{field.charAt(0).toUpperCase() + field.substr(1)}</UiH3>
                                            <SlateReadOnly value={eval(field)} fontSize={modal ? 18 : 20}/>
                                        </React.Fragment>
                                    ))
                            }
                        </div>
                    )}
                    {!notes.every(node => isNodeEmpty(node)) && (
                        <>
                            <UiH3 className="mb-2">Notes</UiH3>
                            <SlateReadOnly value={notes} fontSize={modal ? 16 : 18} className="mb-8"/>
                        </>
                    )}
                </>
            ) : (
                <SlateReadOnly value={body} fontSize={modal ? 18 : 20}/>
            )}
        </>
    ) : (
        <p>Invalid node</p>
    );
}