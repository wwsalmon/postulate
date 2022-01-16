import {GetServerSideProps} from "next";
import Container from "../../../../components/style/Container";
import SEO from "../../../../components/standard/SEO";
import H1 from "../../../../components/style/H1";
import {SlateReadOnly} from "../../../../slate/SlateEditor";
import {format} from "date-fns";
import slateWordCount from "../../../../slate/slateWordCount";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../../../../components/headless/MoreMenu";
import getProjectUrl from "../../../../utils/getProjectUrl";
import PublicNavbar from "../../../../components/project/PublicNavbar";
import UserButton from "../../../../components/standard/UserButton";
import React, {Dispatch, SetStateAction, useState} from "react";
import getPublicNodeSSRFunction, {PublicNodePageProps} from "../../../../utils/getPublicNodeSSRFunction";
import InlineButton from "../../../../components/style/InlineButton";
import {FiExternalLink} from "react-icons/fi";
import ConfirmModal from "../../../../components/standard/ConfirmModal";
import axios from "axios";
import {useRouter} from "next/router";

export function DeleteShortcutModal ({pageUser, pageProject, pageNode, isOpen, setIsOpen}: PublicNodePageProps & {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
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

export default function PublicPostPage(props: PublicNodePageProps) {
    const {pageUser, pageProject, pageNode, thisUser} = props;

    const {body: {publishedTitle: title, publishedBody: body, publishedDate, lastPublishedDate}} = pageNode;
    const isOwner = thisUser && pageNode.userId === thisUser._id;
    const isExternal = !!pageNode.shortcutArr;
    const originalProject = isExternal && pageNode.orrProjectArr[0];

    const [isDeleteShortcutOpen, setIsDeleteShortcutOpen] = useState<boolean>(false);

    return (
        <Container>
            <SEO title={title || `Untitled post`}/>
            <div className="pt-8 pb-32 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
                {isExternal && (
                    <div className="flex items-center mb-8">
                        <FiExternalLink/>
                        <InlineButton href={`${getProjectUrl(pageUser, originalProject)}/p/${pageNode.body.urlName}`} className="ml-2">Originally published</InlineButton>
                        <span className="mx-4"> in </span>
                        <InlineButton href={getProjectUrl(pageUser, originalProject)}>{originalProject.name}</InlineButton>
                    </div>
                )}
                <H1>{title}</H1>
                <UserButton user={pageUser} className="mt-8"/>
                <div className="flex items-center mt-2 mb-8 font-manrope text-gray-400 font-semibold">
                    <span className="mr-4">{format(new Date(publishedDate), "MMM d, yyyy")}</span>
                    {publishedDate !== lastPublishedDate && (<span className="mr-4">{format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    <span className="mr-4">{Math.ceil(slateWordCount(body) / 200)} min read</span>
                    {isOwner && (
                        <>
                            <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                                <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode._id}`}>Edit</MoreMenuItem>
                                {isExternal && (
                                    <MoreMenuItem onClick={() => setIsDeleteShortcutOpen(true)}>Delete shortcut</MoreMenuItem>
                                )}
                            </MoreMenu>
                            <DeleteShortcutModal {...props} isOpen={isDeleteShortcutOpen} setIsOpen={setIsDeleteShortcutOpen}/>
                        </>
                    )}
                </div>
                <SlateReadOnly value={body}/>
            </div>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("post");