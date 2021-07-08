import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {cleanForJSON, fetcher, findImages} from "../../../utils/utils";
import {
    CommentWithAuthor,
    DatedObj,
    LinkObj,
    PostObj,
    ProjectObj,
    ReactionObj,
    SnippetObjGraph,
    UserObj,
    UserObjWithProjects
} from "../../../utils/types";
import ProfileShell from "../../../components/ProfileShell";
import UpSEO from "../../../components/up-seo";
import React, {useState} from "react";
import SlateReadOnly from "../../../components/SlateReadOnly";
import UpInlineButton from "../../../components/style/UpInlineButton";
import {format} from "date-fns";
import readingTime from "reading-time";
import useSWR, {responseInterface} from "swr";
import CommentItem from "../../../components/comment-item";
import CommentContainerItem from "../../../components/comment-container-item";
import {useSession} from "next-auth/client";
import {RiHeartFill, RiHeartLine} from "react-icons/ri";
import axios from "axios";

export default function PostPage({postData, linkedSnippets, projectData, thisOwner, thisAuthor, thisLinks}: {
    postData: DatedObj<PostObj>,
    linkedSnippets: string[],
    projectData: DatedObj<ProjectObj>,
    thisOwner: DatedObj<UserObjWithProjects>,
    thisAuthor: DatedObj<UserObj>,
    thisLinks: DatedObj<LinkObj>[],
}) {
    const [session, loading] = useSession();

    const [reactionsIteration, setReactionsIteration] = useState<number>(0);
    const [commentsIteration, setCommentsIteration] = useState<number>(0);
    const [reactionsUnauthModalOpen, setReactionsUnauthModalOpen] = useState<boolean>(false);

    const {_id: projectId, userId, name: projectName, description, urlName: projectUrlName} = projectData;
    const isOwner = session && (session.userId === thisAuthor._id);
    
    const {data: linkedSnippetsData, error: linkedSnippetsError}: responseInterface<{snippets: DatedObj<SnippetObjGraph>[]}, any> = useSWR(`/api/snippet?ids=${JSON.stringify(linkedSnippets)}`, fetcher);
    const {data: reactions, error: reactionsError}: responseInterface<{data: DatedObj<ReactionObj>[]}, any> = useSWR(`/api/reaction?targetId=${postData._id}&iter=${reactionsIteration}`);
    const {data: comments, error: commentsError}: responseInterface<{data: DatedObj<CommentWithAuthor>[]}, any> = useSWR(`/api/comment?targetId=${postData._id}&iter=${commentsIteration}`);

    function onLike() {
        if (session) {
            axios.post("/api/reaction", {
                targetId: postData._id,
            }).then(() => {
                setReactionsIteration(reactionsIteration + 1);
            }).catch(e => {
                console.log(e);
            });
        } else {
            setReactionsUnauthModalOpen(true);
        }
    }

    return (
        <ProfileShell thisUser={thisOwner} selectedProjectId={projectId}>
            <UpSEO
                title={postData.title}
                description={postData.body.substr(0, 200)}
                projectName={projectData.name}
                imgUrl={findImages(postData.slateBody).length ?  findImages(postData.slateBody)[0] : null}
                authorUsername={thisAuthor.username}
                publishedDate={postData.createdAt}
                noindex={postData.privacy !== "public"}
            />
            <div className="max-w-3xl">
                <div className="items-center mb-8 hidden lg:flex">
                    <UpInlineButton href={`/@${thisOwner.username}`} light={true}>
                        {thisOwner.name}
                    </UpInlineButton>
                    <span className="mx-2 up-gray-300">/</span>
                    <UpInlineButton href={`/@${thisOwner.username}/${projectUrlName}`} light={true}>
                        {projectName}
                    </UpInlineButton>
                    <span className="mx-2 up-gray-300"> / </span>
                </div>
                <h1 className="text-4xl font-medium up-font-display">{postData.title}</h1>
                <div className="flex items-center mt-4 border-b pb-8">
                    <p className="up-gray-400">{format(new Date(postData.createdAt), "MMMM d, yyyy")} | {readingTime(postData.body).text}</p>
                    {reactions && reactions.data && (
                        <div className="ml-auto flex items-center">
                            {reactions.data.length > 0 && (
                                <span className="opacity-25">{reactions.data.length}</span>
                            )}
                            <button className="up-button text small -my-6 ml-2" onClick={onLike} disabled={isOwner}>
                                {(session && reactions.data.some(d => d.userId === session.userId)) ? (
                                    <RiHeartFill/>
                                ) : (
                                    <RiHeartLine/>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className="content prose my-8">
                    <SlateReadOnly
                        nodes={postData.slateBody}
                        projectId={projectData._id}
                        projectName={projectData.name}
                        ownerName={thisOwner.name}
                        isOwner={false}
                    />
                </div>
                <hr className="my-12"/>
                <h3 className="up-ui-title mb-8">Comments ({(comments && comments.data) ? comments.data.length : "loading..."})</h3>
                {session ? (
                    <CommentItem
                        authorId={session.userId}
                        targetId={postData._id}
                        parentCommentId={undefined}
                        iteration={commentsIteration}
                        setIteration={setCommentsIteration}
                    />
                ) : (
                    <p className="mb-8 -mt-4 opacity-50">You must have an account to post a comment.</p>
                )}
                {comments && comments.data && comments.data.filter(d => !d.parentCommentId).map(comment => (
                    <div key={comment._id}>
                        <CommentContainerItem
                            iteration={commentsIteration}
                            setIteration={setCommentsIteration}
                            comment={comment}
                            subComments={comments.data.filter(d => d.parentCommentId === comment._id)}
                        />
                    </div>
                ))}
            </div>
        </ProfileShell>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.postUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const postUrlName: string = context.params.postUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const graphObj = await UserModel.aggregate([
            {$match: { "username": username }},
            {
                $lookup: {
                    from: "posts",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [{$eq: ["$userId", "$$userId"]}, {$eq: ["$urlName", encodeURIComponent(postUrlName)]}]}}},
                        {
                            $lookup: {
                                from: "projects",
                                let: {"projectId": "$projectId"},
                                pipeline: [
                                    {$match: {$expr: {$eq: ["$_id", "$$projectId"]}}},
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: {"userId": "$userId"},
                                            pipeline: [
                                                {$match: {$expr: {$eq: ["$_id", "$$userId"]}}},
                                                {$lookup:
                                                        {
                                                            from: "projects",
                                                            foreignField: "userId",
                                                            localField: "_id",
                                                            as: "projectsArr",
                                                        }
                                                },
                                            ],
                                            as: "ownerArr",
                                        }
                                    },
                                ],
                                as: "projectArr",
                            },
                        },
                        {
                            $lookup: {
                                from: "snippets",
                                let: {"postId": "$_id"},
                                pipeline: [
                                    {$unwind: "$linkedPosts"},
                                    {$match: {$expr: {$eq: ["$linkedPosts", "$$postId"]}}},
                                    {$project: {"_id": 1}},
                                ],
                                as: "linkedSnippetsArr",
                            }
                        },
                        {
                            $lookup: {
                                from: "links",
                                foreignField: "nodeId",
                                localField: "_id",
                                as: "linkArr",
                            }
                        }
                    ],
                    as: "postArr",
                }
            },
        ]);

        // return 404 if missing object at any stage
        if (!graphObj.length || !graphObj[0].postArr.length || !graphObj[0].postArr[0].projectArr.length || !graphObj[0].postArr[0].projectArr[0].ownerArr.length) {
            return { notFound: true };
        }

        const thisAuthor = graphObj[0];
        const thisPost = thisAuthor.postArr[0];
        const linkedSnippets = thisPost.linkedSnippetsArr || [];
        const thisLinks = thisPost.linkArr || [];
        const thisProject = thisPost.projectArr[0];
        const thisOwner = thisProject.ownerArr[0];

        return { props: { postData: cleanForJSON(thisPost), linkedSnippets: linkedSnippets.map(d => d._id.toString()), projectData: cleanForJSON(thisProject), thisOwner: cleanForJSON(thisOwner), thisAuthor: cleanForJSON(thisAuthor), thisLinks: cleanForJSON(thisLinks), key: postUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};