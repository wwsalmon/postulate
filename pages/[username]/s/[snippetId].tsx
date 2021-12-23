import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {cleanForJSON, findImages, snippetGraphStages} from "../../../utils/utils";
import * as mongoose from "mongoose";
import {
    DatedObj,
    ProjectObjWithOwnerWithProjects,
    SnippetObjGraph,
    UserObj,
    UserObjWithProjects
} from "../../../utils/types";
import UpSEO from "../../../components/standard/UpSEO";
import React from "react";
import {format} from "date-fns";
import UpInlineButton from "../../../components/style/UpInlineButton";
import {useSession} from "next-auth/client";
import SlateReadOnly from "../../../components/slate/SlateReadOnly";
import {snippetsExplainer} from "../../../utils/copy";
import {FiArrowLeft} from "react-icons/fi";
import ellipsize from "ellipsize";
import Container from "../../../components/style/Container";

export default function PostPage({snippet, thisAuthor, thisOwner, projectData}: {
    snippet: DatedObj<SnippetObjGraph>,
    projectData: DatedObj<ProjectObjWithOwnerWithProjects>,
    thisAuthor: DatedObj<UserObj>,
    thisOwner: DatedObj<UserObjWithProjects>,
}) {
    const [session, loading] = useSession();
    const isOwner = session && (session.userId === thisAuthor._id);
    const {_id: projectId, userId, name: projectName, description, urlName: projectUrlName} = projectData;

    return (
        <Container>
            <UpSEO
                title={ellipsize(snippet.body, 30)}
                description={snippet.body.substr(0, 200)}
                projectName={projectData.name}
                imgUrl={findImages(snippet.slateBody).length ?  findImages(snippet.slateBody)[0] : null}
                authorUsername={thisAuthor.username}
                publishedDate={snippet.createdAt}
                noindex={snippet.privacy !== "public"}
            />
            <div className="max-w-3xl">
                <div className="items-center mb-8 hidden lg:flex">
                    <UpInlineButton href={`/@${thisOwner.username}`} light={true}>
                        {thisOwner.name}
                    </UpInlineButton>
                    <span className="mx-3 up-gray-300">/</span>
                    <div className="flex items-center">
                        <UpInlineButton href={`/@${thisOwner.username}/${projectUrlName}#snippets`} light={true}>
                            {projectName}
                        </UpInlineButton>
                    </div>
                    <span className="mx-3 up-gray-300"> / </span>
                    <span className="up-gray-300">Snippet</span>
                </div>
                {!isOwner && (
                    <p className="up-gray-400 mb-8">{snippetsExplainer}</p>
                )}
                <div className="rounded-md p-4 border my-8">
                    <div style={{maxWidth: "65ch"}} className="mx-auto">
                        <div className="mt-8 mb-4 flex items-center">
                            <UpInlineButton href={`/@${thisAuthor.username}`}>
                                <div className="flex items-center">
                                    <img
                                        src={thisAuthor.image}
                                        alt={`Profile picture of ${thisAuthor.name}`}
                                        className="w-6 h-6 rounded-full mr-2 opacity-75"
                                    />
                                    <span>{snippet.authorArr[0].name}</span>
                                </div>
                            </UpInlineButton>
                            <p className="up-gray-400 ml-auto">{format(new Date(snippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                        </div>
                        <div className="prose mb-8">
                            <SlateReadOnly
                                nodes={snippet.slateBody}
                                projectId={projectData._id}
                                projectName={projectData.name}
                                ownerName={thisOwner.name}
                                isOwner={false}
                            />
                        </div>
                    </div>
                </div>
                <UpInlineButton className="my-8" href={`/@${thisOwner.username}/${projectUrlName}#snippets`}>
                    <div className="flex items-center">
                        <FiArrowLeft/>
                        <span className="ml-2">Back to project</span>
                    </div>
                </UpInlineButton>
            </div>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.snippetId) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const snippetId: string = context.params.snippetId;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const graphObj = await UserModel.aggregate([
            {$match: { "username": username }},
            {
                $lookup: {
                    from: "snippets",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [{$eq: ["$userId", "$$userId"]}, {$eq: ["$_id", mongoose.Types.ObjectId(snippetId)]}]}}},
                        ...snippetGraphStages,
                    ],
                    as: "snippetArr",
                }
            },
        ]);

        // return 404 if missing object at any stage
        if (!graphObj.length || !graphObj[0].snippetArr.length || !graphObj[0].snippetArr[0].projectArr.length || !graphObj[0].snippetArr[0].projectArr[0].ownerArr.length) {
            return { notFound: true };
        }

        const thisAuthor = graphObj[0];
        const thisSnippet: SnippetObjGraph = thisAuthor.snippetArr[0];
        const thisProject = thisSnippet.projectArr[0];
        const thisOwner = thisProject.ownerArr[0];

        return { props: { snippet: cleanForJSON(thisSnippet), thisAuthor: cleanForJSON(thisAuthor), projectData: cleanForJSON(thisProject), thisOwner: cleanForJSON(thisOwner), key: snippetId }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};