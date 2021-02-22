import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../../models/user";
import {ProjectModel} from "../../../../models/project";
import {cleanForJSON, fetcher} from "../../../../utils/utils";
import {PostModel} from "../../../../models/post";
import {DatedObj, PostObj, ProjectObj, UserObj} from "../../../../utils/types";
import {useRouter} from "next/router";
import React, {useState} from "react";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import Parser from "html-react-parser";
import Link from "next/link";
import {useSession} from "next-auth/client";
import MoreMenu from "../../../../components/more-menu";
import MoreMenuItem from "../../../../components/more-menu-item";
import {FiEdit2, FiTrash} from "react-icons/fi";
import UpModal from "../../../../components/up-modal";
import SpinnerButton from "../../../../components/spinner-button";
import axios from "axios";
import {format} from "date-fns";
import UpSEO from "../../../../components/up-seo";
import useSWR, {responseInterface} from "swr";
import Skeleton from "react-loading-skeleton";
import PublicPostItem from "../../../../components/public-post-item";

export default function PublicPost(props: {
    postData: DatedObj<PostObj>,
    projectData: DatedObj<ProjectObj>,
    thisOwner: DatedObj<UserObj>,
    thisAuthor: DatedObj<UserObj>,
}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const {_id: projectId, userId, name: projectName, description, urlName: projectUrlName} = props.projectData;
    const [body, setBody] = useState<string>(props.postData.body);
    const [title, setTitle] = useState<string>(props.postData.title);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const {data: latestPosts, error: latestPostsError}: responseInterface<{posts: DatedObj<PostObj>[], authors: DatedObj<UserObj>[] }, any> = useSWR(`/api/post?projectId=${props.projectData._id}`, fetcher);

    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    const isOwner = session && props.thisAuthor._id === session.userId;

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

    return (
        <div className="max-w-4xl mx-auto px-4 pb-16">
            <UpSEO
                title={title}
                description={body.substr(0, 200)}
                projectName={props.projectData.name}
                imgUrl={props.postData.body.match(/!\[.*?\]\((.*?)\)/) ? props.postData.body.match(/!\[.*?\]\((.*?)\)/)[1] : null}
            />
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
            <hr className="my-8"/>
            <div className="content prose">
                {Parser(markdownConverter.makeHtml(body))}
            </div>
            <hr className="my-8"/>
            <p className="up-ui-title mb-10">
                Latest posts in <Link href={`/@${props.thisOwner.username}/${projectUrlName}`}>
                    <a className="underline">{projectName}</a>
                </Link>
            </p>
            {latestPosts ? latestPosts.posts.filter(d => d._id !== props.postData._id).length ? (
                latestPosts.posts.filter(d => d._id !== props.postData._id).slice(0).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(post => (
                    <PublicPostItem
                        post={post}
                        author={latestPosts.authors.find(d => d._id === post.userId)}
                        urlPrefix={`/@${props.thisOwner.username}/${props.projectData.urlName}`}
                    />
                ))
            ) : (
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
        Array.isArray(context.params.projectUrlName) ||
        Array.isArray(context.params.postUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;
    const postUrlName: string = context.params.postUrlName;

    // fetch project info from MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const thisOwner = await UserModel.findOne({ username: username });

        if (!thisOwner) return { notFound: true };

        const thisProject = await ProjectModel.findOne({ userId: thisOwner._id, urlName: projectUrlName });

        if (!thisProject) return { notFound: true };

        const thisPost = await PostModel.findOne({ projectId: thisProject._id, urlName: encodeURIComponent(postUrlName) });

        if (!thisPost) return { notFound: true };

        let thisAuthor = thisOwner;

        // if collaborator, fetch collaborator object
        if (thisPost.userId !== thisAuthor._id.toString()) {
            thisAuthor = await UserModel.findOne({ _id: thisPost.userId });
        }

        return { props: { postData: cleanForJSON(thisPost), projectData: cleanForJSON(thisProject), thisOwner: cleanForJSON(thisOwner), thisAuthor: cleanForJSON(thisAuthor), key: postUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};