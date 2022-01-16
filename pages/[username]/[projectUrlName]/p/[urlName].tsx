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
import React from "react";
import getPublicNodeSSRFunction, {PublicNodePageProps} from "../../../../utils/getPublicNodeSSRFunction";

export default function PublicPostPage({pageUser, pageProject, pageNode, thisUser}: PublicNodePageProps) {
    const {body: {publishedTitle: title, publishedBody: body, publishedDate, lastPublishedDate}} = pageNode;
    const isOwner = thisUser && pageNode.userId === thisUser._id;

    return (
        <Container>
            <SEO title={title || `Untitled post`}/>
            <div className="pt-8 pb-32 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
                <H1>{title}</H1>
                <UserButton user={pageUser} className="mt-8"/>
                <div className="flex items-center mt-2 mb-8 font-manrope text-gray-400 font-semibold">
                    <span className="mr-4">{format(new Date(publishedDate), "MMM d, yyyy")}</span>
                    {publishedDate !== lastPublishedDate && (<span className="mr-4">{format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    <span className="mr-4">{Math.ceil(slateWordCount(body) / 200)} min read</span>
                    {isOwner && (
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode._id}`}>Edit</MoreMenuItem>
                        </MoreMenu>
                    )}
                </div>
                <SlateReadOnly value={body}/>
            </div>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("post");