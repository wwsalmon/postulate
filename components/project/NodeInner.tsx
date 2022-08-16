import H1 from "../style/H1";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import {SlateReadOnly} from "../../slate/SlateEditor";
import Badge from "../style/Badge";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getIsNodeUpdated} from "../../pages/[username]/[projectUrlName]/[id]";
import UiH3 from "../style/UiH3";
import {isNodeEmpty} from "../../slate/withDeserializeMD";
import UserButton from "../standard/UserButton";
import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import InlineButton from "../style/InlineButton";
import {FiExternalLink} from "react-icons/fi";
import Banner from "../style/Banner";
import {useRouter} from "next/router";
import axios from "axios";
import ConfirmModal from "../standard/ConfirmModal";
import slateWordCount from "../../slate/slateWordCount";
import {NodeObjPostOrEvergreenPublic, NodeObjPublic, NodeObjSourcePublic} from "../../utils/types";
import {Node} from "slate";

function DeleteShortcutModal ({pageUser, pageProject, pageNode, isOpen, setIsOpen}: PublicNodePageProps & {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
    const router = useRouter();

    const originalProject = pageNode.project;
    const pageShortcut = pageNode.shortcut;
    const nodeType = pageNode.type;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onDelete() {
        setIsLoading(true);

        axios.delete("/api/shortcut", {data: {id: pageShortcut._id}}).then(() => {
            router.push(`${getProjectUrl(pageUser, pageProject)}/${nodeType}s?refresh=true`);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    return (
        <ConfirmModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onConfirm={onDelete}
            confirmText="Delete"
            colorClass="bg-red-500 hover:bg-red-700"
        >
            <p className="mb-3">
                Are you sure you want to delete this shortcut?
            </p>
            <p className="mb-3">
                This {nodeType} will stop appearing under <b>{pageProject.name}</b> but the original version in <b>{originalProject.name}</b> will be untouched.
            </p>
        </ConfirmModal>
    )
}

export default function NodeInner(props: PublicNodePageProps & {isModal?: boolean}) {
    const {pageUser, pageNode, pageProject, thisUser, isModal} = props;

    const {
        body: {
            title: privateTitle,
        },
        createdAt,
        updatedAt
    } = pageNode;

    const {
        body: {
            notes: privateNotes,
            summary: privateSummary,
            takeaways: privateTakeaways,
            sourceInfo: privateSourceInfo,
        },
    } = pageNode.type === "source" ? pageNode : {body: {notes: false, summary: false, takeaways: false, sourceInfo: false}};

    const {
        body: {
            publishedNotes,
            publishedSummary,
            publishedTakeaways,
            publishedSourceInfo,
        },
    } = (pageNode.type === "source" && ("urlName" in pageNode.body)) ? pageNode as NodeObjSourcePublic : {body: {publishedNotes: false, publishedSummary: false, publishedTakeaways: false, publishedSourceInfo: false}};

    const {
        body: {
            publishedTitle,
            publishedDate,
            lastPublishedDate
        }
    } = "urlName" in pageNode.body ? pageNode as NodeObjPublic : {body: {publishedTitle: false, publishedDate: false, lastPublishedDate: false}};

    const {
        body: {
            body: privateBody,
        },
    } = pageNode.type !== "source" ? pageNode : {body: {body: false}};

    const {
        body: {
            publishedBody,
        },
    } = (pageNode.type !== "source" && "urlName" in pageNode.body) ? pageNode as NodeObjPostOrEvergreenPublic : {body: {publishedBody: false}};

    const isPost = pageNode.type === "post";
    const isSource = pageNode.type === "source";
    const isOwner = thisUser && pageNode.userId === thisUser._id;
    const isPublished = "urlName" in pageNode.body;
    const isExternal = !!pageNode.shortcut;
    const originalProject = isExternal && pageNode.project[0];
    const title = publishedTitle || privateTitle;
    const body = publishedBody || privateBody;
    const notes = publishedNotes || privateNotes;
    const summary = publishedSummary || privateSummary;
    const takeaways = publishedTakeaways || privateTakeaways;
    const sourceInfo = publishedSourceInfo || privateSourceInfo;
    const isUpdated = !isOwner || getIsNodeUpdated(pageNode);

    const hasSummaryOrTakeaways = isSource && [summary, takeaways].some(d => !(d as unknown as Node[]).every(x => isNodeEmpty(x)));

    const [isDeleteShortcutOpen, setIsDeleteShortcutOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {setIsMobile(window.matchMedia("(max-width: 600px)").matches)}, []);

    return (title && (body || (notes && summary && takeaways && sourceInfo))) ? (
        <>
            {isSource && (<UiH3 className="mb-2">Source notes</UiH3>)}
            {isExternal && isPost && "urlName" in pageNode.body && (
                <div className="flex items-center mb-8">
                    <FiExternalLink/>
                    <InlineButton href={`${getProjectUrl(pageUser, originalProject)}/p/${pageNode.body.urlName}`} className="ml-2">Originally published</InlineButton>
                    <span className="mx-4"> in </span>
                    <InlineButton href={getProjectUrl(pageUser, originalProject)}>{originalProject.name}</InlineButton>
                </div>
            )}
            <H1 small={!isPost}>{title}</H1>
            {!isModal && (
                <UserButton user={pageUser} className="mt-8 sm:hidden"/>
            )}
            {pageNode.type === "source" && !(sourceInfo as unknown as Node[]).every(d => isNodeEmpty(d)) && (
                <SlateReadOnly value={sourceInfo as unknown as Node[]} className="text-gray-400" fontSize={16}/>
            )}
            {isExternal && !isPost && "urlName" in pageNode.body && (
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
            <div className={`${(!isPublished || isUpdated) ? "sm:flex" : "flex"} items-center ${isSource ? "mb-8" : "my-8"} w-full`}>
                <div className="flex items-center justify-between flex-grow mb-2 sm:mb-0 order-2">
                    {!isPublished && (
                        <Badge dark={true}>
                            <span>Unpublished draft</span>
                        </Badge>
                    )}
                    {!isUpdated && (
                        <Badge>
                            <span>Unpublished changes</span>
                        </Badge>
                    )}
                    {(isOwner || "urlName" in pageNode.body) && (
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            {isOwner && (
                                <MoreMenuItem href={`${getProjectUrl(pageUser, originalProject || pageProject)}/${pageNode._id}`}>
                                    {`Edit${isExternal ? " in original project" : ""}`}
                                </MoreMenuItem>
                            )}
                            {isModal && "urlName" in pageNode.body && (
                                <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                    View as page
                                </MoreMenuItem>
                            )}
                            {isExternal && "urlName" in pageNode.body && (
                                <>
                                    <MoreMenuItem href={`${getProjectUrl(pageUser, originalProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                        View in original project
                                    </MoreMenuItem>
                                    {isOwner && (
                                        <MoreMenuItem onClick={() => setIsDeleteShortcutOpen(true)}>
                                            Delete shortcut
                                        </MoreMenuItem>
                                    )}
                                </>
                            )}
                        </MoreMenu>
                    )}
                    {isExternal && (
                        <DeleteShortcutModal
                            {...props}
                            isOpen={isDeleteShortcutOpen}
                            setIsOpen={setIsDeleteShortcutOpen}
                        />
                    )}
                </div>
                <div className="flex items-center flex-wrap font-manrope text-gray-400 font-semibold">
                    <span className="mr-4">{format(new Date(("urlName" in pageNode.body ? publishedDate : createdAt) as string), "MMM d, yyyy")}</span>
                    {"urlName" in pageNode.body && publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate as string), "MMM d, yyyy")}</span>)}
                    {!isPublished && createdAt !== updatedAt && (<span className="mr-4">Last updated {format(new Date(updatedAt), "MMM d, yyyy")}</span>)}
                    {pageNode.type === "post" && (<span className="mr-4">{Math.ceil(slateWordCount(body as unknown as Node[]) / 200)} min read</span>)}
                </div>
            </div>
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
                                            <SlateReadOnly
                                                value={eval(field)}
                                                fontSize={isModal ? (isMobile ? 16 : 18) : (isMobile ? 18 : 20)}
                                            />
                                        </React.Fragment>
                                    ))
                            }
                        </div>
                    )}
                    {!(notes as unknown as Node[]).every(node => isNodeEmpty(node)) && (
                        <>
                            <UiH3 className="mb-2">Notes</UiH3>
                            <SlateReadOnly value={notes as unknown as Node[]} fontSize={isModal ? 16 : 18} className="mb-8"/>
                        </>
                    )}
                </>
            ) : (
                <SlateReadOnly value={body as unknown as Node[]} fontSize={isModal ? (isMobile ? 16 : 18) : (isMobile ? 18 : 20)}/>
            )}
        </>
    ) : (
        <p>Invalid node</p>
    );
}