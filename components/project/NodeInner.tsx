import H1 from "../style/H1";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import {SlateReadOnly} from "../../slate/SlateEditor";
import Badge from "../style/Badge";
import React, {Dispatch, SetStateAction, useState} from "react";
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

function DeleteShortcutModal ({pageUser, pageProject, pageNode, isOpen, setIsOpen}: PublicNodePageProps & {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
    const router = useRouter();

    const originalProject = pageNode.orrProjectArr[0];
    const pageShortcut = pageNode.shortcutArr[0];
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
    const isPost = pageNode.type === "post";
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

    const [isDeleteShortcutOpen, setIsDeleteShortcutOpen] = useState<boolean>(false);

    return (title && (body || (notes && summary && takeaways && link !== undefined))) ? (
        <>
            {isSource && (<UiH3 className="mb-2">Source notes</UiH3>)}
            {isExternal && isPost && (
                <div className="flex items-center mb-8">
                    <FiExternalLink/>
                    <InlineButton href={`${getProjectUrl(pageUser, originalProject)}/p/${pageNode.body.urlName}`} className="ml-2">Originally published</InlineButton>
                    <span className="mx-4"> in </span>
                    <InlineButton href={getProjectUrl(pageUser, originalProject)}>{originalProject.name}</InlineButton>
                </div>
            )}
            <H1 small={!isPost}>{title}</H1>
            {!isModal && (
                <UserButton user={pageUser} className="mt-8"/>                
            )}
            {isSource && link && (<a className="text-gray-400 my-4 truncate underline block" href={link}>{link}</a>)}
            {isExternal && !isPost && (
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
                            {isModal && isPublished && (
                                <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                    View as page
                                </MoreMenuItem>
                            )}
                            {isExternal && (
                                <>
                                    <MoreMenuItem href={`${getProjectUrl(pageUser, originalProject)}/${pageNode.type.charAt(0)}/${pageNode.body.urlName}`}>
                                        View in original project
                                    </MoreMenuItem>
                                    <MoreMenuItem onClick={() => setIsDeleteShortcutOpen(true)}>
                                        Delete shortcut
                                    </MoreMenuItem>
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
                    <span className="mr-4">{format(new Date(publishedDate || createdAt), "MMM d, yyyy")}</span>
                    {isPublished && publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    {!isPublished && createdAt !== updatedAt && (<span className="mr-4">Last updated {format(new Date(updatedAt), "MMM d, yyyy")}</span>)}
                    {isPost && (<span className="mr-4">{Math.ceil(slateWordCount(body) / 200)} min read</span>)}
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
                                            <SlateReadOnly value={eval(field)} fontSize={isModal ? 18 : 20}/>
                                        </React.Fragment>
                                    ))
                            }
                        </div>
                    )}
                    {!notes.every(node => isNodeEmpty(node)) && (
                        <>
                            <UiH3 className="mb-2">Notes</UiH3>
                            <SlateReadOnly value={notes} fontSize={isModal ? 16 : 18} className="mb-8"/>
                        </>
                    )}
                </>
            ) : (
                <SlateReadOnly value={body} fontSize={isModal ? 18 : 20}/>
            )}
        </>
    ) : (
        <p>Invalid node</p>
    );
}