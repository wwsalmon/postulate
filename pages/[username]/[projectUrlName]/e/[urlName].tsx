import {GetServerSideProps} from "next";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../../utils/types";
import Container from "../../../../components/style/Container";
import SEO from "../../../../components/standard/SEO";
import H1 from "../../../../components/style/H1";
import {SlateReadOnly} from "../../../../slate/SlateEditor";
import {format} from "date-fns";
import slateWordCount from "../../../../slate/slateWordCount";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../../../../components/headless/MoreMenu";
import getProjectUrl from "../../../../utils/getProjectUrl";
import PublicNavbar from "../../../../components/project/PublicNavbar";
import {getPublicNodeSSRFunction, PublicNodePageProps} from "../p/[urlName]";

export default function PublicEvergreenPage({pageUser, pageProject, pageNode, thisUser}: PublicNodePageProps) {
    const {body: {publishedTitle: title, publishedBody: body, publishedDate, lastPublishedDate}} = pageNode;
    const isOwner = thisUser && pageNode.userId === thisUser._id;

    return (
        <div className="p-8 border border-gray-300 rounded-md my-8 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
            <SEO title={title || `Untitled post`}/>
            <H1 small={true}>{title}</H1>
            <div className="flex items-center my-8 font-manrope text-gray-400 font-semibold">
                <span className="mr-4">{format(new Date(publishedDate), "MMM d, yyyy")}</span>
                {publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                {isOwner && (
                    <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                        <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode._id}`}>Edit</MoreMenuItem>
                    </MoreMenu>
                )}
            </div>
            <SlateReadOnly value={body}/>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("evergreen");