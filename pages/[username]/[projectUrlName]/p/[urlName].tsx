import {GetServerSideProps} from "next";
import dbConnect from "../../../../utils/dbConnect";
import getThisUser from "../../../../utils/getThisUser";
import {getProjectPageInfo} from "../new/[type]";
import {ssr404} from "next-response-helpers";
import {NodeModel} from "../../../../models/node";
import {cleanForJSON} from "../../../../utils/utils";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../../utils/types";
import Container from "../../../../components/style/Container";
import SEO from "../../../../components/standard/SEO";
import H1 from "../../../../components/style/H1";
import {SlateReadOnly} from "../../../../slate/SlateEditor";
import {format} from "date-fns";
import slateWordCount from "../../../../slate/slateWordCount";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../../../../components/headless/MoreMenu";
import getProjectUrl from "../../../../utils/getProjectUrl";
import InlineButton from "../../../../components/style/InlineButton";
import Button from "../../../../components/headless/Button";

export default function PublicPostPage({pageUser, pageProject, pagePost, thisUser}: {
    pageUser: DatedObj<UserObj>,
    pageProject: DatedObj<ProjectObj>,
    pagePost: DatedObj<NodeObj>,
    thisUser: DatedObj<UserObj>,
}) {
    const {body: {publishedTitle: title, publishedBody: body, publishedDate, lastPublishedDate}} = pagePost;
    const isOwner = thisUser && pagePost.userId === thisUser._id;

    return (
        <Container>
            <SEO title={title || `Untitled post`}/>
            <div className="pt-8 pb-32 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
                <H1>{title}</H1>
                <div className="flex items-center my-8 font-manrope text-gray-400 font-semibold">
                    <span className="mr-4">{format(new Date(publishedDate), "MMM d, yyyy")}</span>
                    {publishedDate !== lastPublishedDate && (<span className="mr-4">{format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                    <span className="mr-4">{Math.ceil(slateWordCount(body) / 200)} min read</span>
                    {isOwner && (
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pagePost._id}`}>Edit</MoreMenuItem>
                        </MoreMenu>
                    )}
                </div>
                <SlateReadOnly value={body}/>
            </div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 flex items-center z-40 transform h-12 sm:h-16">
                <Button href={getProjectUrl(pageUser, pageProject)} className="font-manrope font-bold text-lg">
                    {pageProject.name}
                </Button>
                <span className="mx-4 text-gray-300 hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center">
                    <InlineButton href={`/@${pageUser.username}`} flex={true}>
                        <img src={pageUser.image} alt={`Profile picture of ${pageUser.name}`} className="rounded-full w-6 h-6"/>
                        <span className="ml-2">{pageUser.name}</span>
                    </InlineButton>
                </div>
            </div>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {urlName} = context.params;

    try {
        await dbConnect();

        const pageInfo = await getProjectPageInfo(context);

        if (!pageInfo) return ssr404;

        const {pageUser, pageProject} = pageInfo;

        const pagePost = await NodeModel.findOne({
            type: "post",
            "body.urlName": encodeURIComponent(urlName.toString()),
            projectId: pageProject._id,
        });

        if (!pagePost) return ssr404;

        const thisUser = await getThisUser(context);

        let newPagePost = {...pagePost.toObject()};

        if (!thisUser || (thisUser._id.toString() !== pageProject.userId.toString())) {
            delete newPagePost.body.title;
            delete newPagePost.body.body;
        }

        return {props: cleanForJSON({pageUser, pageProject, pagePost: newPagePost, thisUser})};
    } catch (e) {
        console.log(e);
        return ssr404;
    }
}