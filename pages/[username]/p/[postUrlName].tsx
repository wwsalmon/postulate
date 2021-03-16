import {GetServerSideProps} from "next";
import {UserModel} from "../../../models/user";
import {cleanForJSON, fetcher} from "../../../utils/utils";
import {CommentWithAuthor, DatedObj, PostObj, ProjectObj, ReactionObj, SnippetObj, UserObj} from "../../../utils/types";
import {useRouter} from "next/router";
import React, {useState} from "react";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import Parser from "html-react-parser";
import Link from "next/link";
import {useSession} from "next-auth/client";
import MoreMenu from "../../../components/more-menu";
import MoreMenuItem from "../../../components/more-menu-item";
import {FiChevronDown, FiChevronUp, FiEdit2, FiTrash} from "react-icons/fi";
import UpModal from "../../../components/up-modal";
import SpinnerButton from "../../../components/spinner-button";
import axios from "axios";
import {format} from "date-fns";
import UpSEO from "../../../components/up-seo";
import useSWR, {responseInterface} from "swr";
import Skeleton from "react-loading-skeleton";
import PublicPostItem from "../../../components/public-post-item";
import InlineCTA from "../../../components/inline-cta";
import dbConnect from "../../../utils/dbConnect";
import UpBanner from "../../../components/UpBanner";
import Accordion from "react-robust-accordion";
import SnippetItemReduced from "../../../components/snippet-item-reduced";
import {RiHeartFill, RiHeartLine} from "react-icons/ri";
import CommentItem from "../../../components/comment-item";

export default function PublicPost(props: {
    postData: DatedObj<PostObj>,
    linkedSnippets: string[],
    projectData: DatedObj<ProjectObj>,
    thisOwner: DatedObj<UserObj>,
    thisAuthor: DatedObj<UserObj>,
}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const {_id: projectId, userId, name: projectName, description, urlName: projectUrlName} = props.projectData;
    const isOwner = session && props.thisAuthor._id === session.userId;

    const [body, setBody] = useState<string>(props.postData.body);
    const [title, setTitle] = useState<string>(props.postData.title);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [viewLinkedSnippetsOpen, setViewLinkedSnippetsOpen] = useState<boolean>(false);
    const [reactionsIteration, setReactionsIteration] = useState<number>(0);
    const [reactionsUnauthModalOpen, setReactionsUnauthModalOpen] = useState<boolean>(false);
    const [commentsIteration, setCommentsIteration] = useState<number>(0);
    const {data: latestPosts, error: latestPostsError}: responseInterface<{posts: DatedObj<PostObj>[], authors: DatedObj<UserObj>[] }, any> = useSWR(`/api/post?projectId=${props.projectData._id}`, fetcher);
    const {data: linkedSnippets, error: linkedSnippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[], authors: DatedObj<UserObj>[]}, any> = useSWR(`/api/snippet?ids=${JSON.stringify(props.linkedSnippets)}&iter=${+isOwner}`, isOwner ? fetcher : () => []);
    const {data: reactions, error: reactionsError}: responseInterface<{data: DatedObj<ReactionObj>[]}, any> = useSWR(`/api/reaction?targetId=${props.postData._id}&iter=${reactionsIteration}`);
    const {data: comments, error: commentsError}: responseInterface<{data: DatedObj<CommentWithAuthor>[]}, any> = useSWR(`/api/comment?targetId=${props.postData._id}&iter=${commentsIteration}`);

    const linkedSnippetsReady = linkedSnippets && linkedSnippets.snippets && !!linkedSnippets.snippets.length;

    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    const latestPostsReady = latestPosts && latestPosts.posts && latestPosts.authors;
    const filteredPosts = latestPostsReady ? latestPosts.posts.filter(post => post.privacy === "public" && post._id !== props.postData._id) : [];

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete("/api/post", {
            data: {
                postId: props.postData._id,
                tempId: props.postData.urlName,
            }
        }).then(() => {
            router.push(`/@${props.thisOwner.username}/${projectUrlName}`);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    function onLike() {
        if (session) {
            axios.post("/api/reaction", {
                targetId: props.postData._id,
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
        <div className="mx-auto px-4 pb-16" style={{maxWidth: 780}}>
            <UpSEO
                title={title}
                description={body.substr(0, 200)}
                projectName={props.projectData.name}
                imgUrl={props.postData.body.match(/!\[.*?\]\((.*?)\)/) ? props.postData.body.match(/!\[.*?\]\((.*?)\)/)[1] : null}
                authorUsername={props.thisAuthor.username}
                publishedDate={props.postData.createdAt}
                noindex={props.postData.privacy !== "public"}
            />
            {(props.postData.privacy === "unlisted") && (
                <UpBanner className="mb-8">
                    <p>This is an <b>unlisted</b> post. It does not show up in any public profiles or web searches. It is only accessible by direct link, so be mindful about sharing it.</p>
                </UpBanner>
            )}
            {(props.postData.privacy === "private") && (
                <UpBanner className="mb-8">
                    <p>This is a <b>private</b> post. It can only be accessed by the project owner and collaborators.</p>
                </UpBanner>
            )}
            <div className="flex">
                <h1 className="up-h1">{title}</h1>
                <div className="ml-auto">
                    {isOwner && (
                        <div className="ml-auto">
                            <MoreMenu>
                                <MoreMenuItem text="Edit" icon={<FiEdit2/>} href={`/post/${props.postData._id}?back=${encodeURIComponent(document.location.href)}`}/>
                                <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
                            </MoreMenu>
                            <UpModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}>
                                <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                                <div className="flex mt-4">
                                    <SpinnerButton isLoading={isDeleteLoading} onClick={onDelete}>
                                        Delete
                                    </SpinnerButton>
                                    <button className="up-button text" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                                </div>
                            </UpModal>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex my-8 items-center">
                <Link href={`/@${props.thisAuthor.username}`}>
                    <a>
                        <img src={props.thisAuthor.image} alt={`Profile picture of ${props.thisAuthor.name}`} className="w-10 h-10 rounded-full mr-4"/>
                    </a>
                </Link>
                <div>
                    <Link href={`/@${props.thisAuthor.username}`}>
                        <a className="font-bold">
                            {props.thisAuthor.name}
                        </a>
                    </Link>
                    <p className="opacity-50">
                        <span>{format(new Date(props.postData.createdAt), "MMMM d, yyyy")} in project: </span>
                        <Link href={`/@${props.thisOwner.username}/${projectUrlName}`}>
                            <a className="underline">{projectName}</a>
                        </Link>
                    </p>
                </div>
            </div>
            <div className="flex items-center">
                {(!!props.postData.tags.length || !!props.linkedSnippets.length) && (
                    <div>
                        {!!props.postData.tags.length && (
                            <span className="opacity-50">
                            <span>Tags: </span>
                                {props.postData.tags.map(tag => (
                                    <Link href="">
                                        <a className="font-bold">#{tag}</a>
                                    </Link>
                                ))}
                        </span>
                        )}
                        {!!props.postData.tags.length && !!props.linkedSnippets.length && <span className="opacity-25 inline-block mx-2"> | </span>}
                        {!!props.linkedSnippets.length && (
                            <span className="opacity-25">{props.linkedSnippets.length} linked {props.linkedSnippets.length === 1 ? "snippet" : "snippets"}</span>
                        )}
                    </div>
                )}
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
                <UpModal isOpen={reactionsUnauthModalOpen} setIsOpen={setReactionsUnauthModalOpen}>
                    <p>You must have an account to react to posts.</p>
                    <button className="up-button mt-4 primary" onClick={() => setReactionsUnauthModalOpen(false)}>Okay</button>
                </UpModal>
            </div>
            {isOwner && !!props.linkedSnippets.length && (
                <UpBanner className="my-8">
                    <Accordion
                        label={(
                            <div className="w-full flex items-center">
                                <h3 className="up-ui-title">View linked snippets ({props.linkedSnippets.length})</h3>
                                <div className="ml-auto">
                                    {viewLinkedSnippetsOpen ? (
                                        <FiChevronUp/>
                                    ) : (
                                        <FiChevronDown/>
                                    )}
                                </div>
                            </div>
                        )}
                        openState={viewLinkedSnippetsOpen}
                        setOpenState={setViewLinkedSnippetsOpen}
                    >
                        {linkedSnippetsReady && linkedSnippets.snippets.map((snippet, i, a) => (
                            <div key={snippet._id}>
                                {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                    <p className="opacity-50 mt-8 pb-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                                )}
                                <SnippetItemReduced snippet={snippet} authors={linkedSnippets.authors} isPostPage={true}/>
                            </div>
                        ))}
                    </Accordion>
                </UpBanner>
            )}
            <hr className="my-8"/>
            <div className="content prose">
                {Parser(markdownConverter.makeHtml(body))}
            </div>
            {!session && (
                <>
                    <hr className="my-8"/>
                    <InlineCTA/>
                </>
            )}
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-8">Comments ({(comments && comments.data) ? comments.data.length : "loading..."})</h3>
            {session ? (
                <CommentItem
                    authorId={session.userId}
                    targetId={props.postData._id}
                    parentCommentId={undefined}
                    iteration={commentsIteration}
                    setIteration={setCommentsIteration}
                />
            ) : (
                <p>You must have an account to post a comment.</p>
            )}
            {comments && comments.data && comments.data.map(comment => (
                <CommentItem comment={comment} iteration={commentsIteration} setIteration={setCommentsIteration}/>
            ))}
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-10">
                Latest posts in <Link href={`/@${props.thisOwner.username}/${projectUrlName}`}>
                    <a className="underline">{projectName}</a>
                </Link> by <Link href={`/@${props.thisOwner.username}`}>
                    <a className="underline">
                        {props.thisOwner.name}
                    </a>
                </Link>
            </h3>
            {latestPostsReady ? filteredPosts.length ? filteredPosts.map(post => (
                <PublicPostItem
                    post={post}
                    author={latestPosts.authors.find(d => d._id === post.userId)}
                    urlPrefix={`/@${props.thisOwner.username}/${props.projectData.urlName}`}
                />
            )) : (
                <p className="my-4">No other posts in this project</p>
            ) : (
                <Skeleton className="h-24"/>
            )}
        </div>
    )
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
                                            localField: "userId",
                                            foreignField: "_id",
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
        const thisProject = thisPost.projectArr[0];
        const thisOwner = thisProject.ownerArr[0];

        return { props: { postData: cleanForJSON(thisPost), linkedSnippets: linkedSnippets.map(d => d._id.toString()), projectData: cleanForJSON(thisProject), thisOwner: cleanForJSON(thisOwner), thisAuthor: cleanForJSON(thisAuthor), key: postUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};