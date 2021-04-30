import {GetServerSideProps} from "next";
import {ProjectModel} from "../../../models/project";
import {UserModel} from "../../../models/user";
import {cleanForJSON, fetcher} from "../../../utils/utils";
import {DatedObj, PostObj, PostObjGraph, ProjectObj, UserObj} from "../../../utils/types";
import React, {useState} from "react";
import {useSession} from "next-auth/client";
import Link from "next/link";
import "easymde/dist/easymde.min.css";
import useSWR, {responseInterface} from "swr";
import Skeleton from "react-loading-skeleton";
import UpSEO from "../../../components/up-seo";
import UpBanner from "../../../components/UpBanner";
import PublicPostItem from "../../../components/public-post-item";
import InlineCTA from "../../../components/inline-cta";
import dbConnect from "../../../utils/dbConnect";
import UpInlineButton from "../../../components/style/UpInlineButton";
import {FiArrowLeft} from "react-icons/fi";
import ProjectStats from "../../../components/ProjectStats";
import PaginationBar from "../../../components/PaginationBar";
import PaginationBanner from "../../../components/PaginationBanner";
import {SearchControl} from "../../projects/[projectId]";
import FilterBanner from "../../../components/FilterBanner";

export default function Project(props: {projectData: DatedObj<ProjectObj>, thisUser: DatedObj<UserObj>}) {
    const [session, loading] = useSession();
    const [{_id: projectId, userId, name, description, urlName, createdAt, stars, collaborators, availableTags }, setProjectData] = useState<DatedObj<ProjectObj>>(props.projectData);
    const [postPage, setPostPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const isOwner = session && session.userId === userId;
    const isCollaborator = session && props.projectData.collaborators.includes(session.userId);
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${projectId}&page=${postPage}&search=${searchQuery}`, fetcher);

    const postsReady = posts && posts.posts;
    const filteredPosts = postsReady ? posts.posts.filter(post => post.privacy === "public") : [];

    const [tab, setTab] = useState<"posts" | "snippets" | "stats">("posts");

    return (
        <>
            <UpSEO title={props.projectData.name} description={props.projectData.description}/>
            <div className="w-full up-bg-gray-50 -mt-8 border-t border-b mb-12 up-border-gray-200">
                <div className="max-w-4xl mx-auto px-4 pt-4">
                    <div className="flex items-center">
                        {(isOwner || isCollaborator) && (
                            <>
                                <UpInlineButton href={`/projects/${projectId}`} light={true}>
                                    <div className="flex items-center">
                                        <FiArrowLeft/>
                                        <span className="ml-4">
                                        Back to project
                                    </span>
                                    </div>
                                </UpInlineButton>
                                <span className="mx-2 up-gray-300"> / </span>
                            </>
                        )}
                        <UpInlineButton href={`/@${props.thisUser.username}`} light={true}>
                            {props.thisUser.name}
                        </UpInlineButton>
                        <span className="ml-2 up-gray-300">/</span>
                    </div>
                    <h1 className="up-h1 mt-6 mb-2">{name}</h1>
                    <p className="content up-gray-400">{description}</p>
                    <div className="flex items-center h-12 mt-8">
                        <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "posts" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("posts")}>
                            Public posts ({posts ? filteredPosts.length : "Loading..."})
                        </button>
                        <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "stats" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("stats")}>
                            Stats
                        </button>
                        <div className="ml-auto hidden md:block">
                            <SearchControl
                                snippetSearchQuery={searchQuery}
                                setSnippetPage={setPostPage}
                                setSnippetSearchQuery={setSearchQuery}
                                breakpoint="md"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4">
                {tab === "posts" ? postsReady ? filteredPosts.length > 0 ? (
                    <>
                        <div className="mb-4 -mt-4">
                            <FilterBanner
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                tagsQuery={[]}
                                setTagsQuery={() => null}
                            />
                        </div>
                        <PaginationBanner page={postPage} label="posts" setPage={setPostPage} className="-mt-4 mb-12"/>
                        <div className="-mt-8 mb-12 md:hidden">
                            <SearchControl
                                snippetSearchQuery={searchQuery}
                                setSnippetPage={setPostPage}
                                setSnippetSearchQuery={setSearchQuery}
                                breakpoint="md"
                            />
                        </div>
                        <div className="mt-16">
                            {filteredPosts.map(post => (
                                <PublicPostItem
                                    post={post}
                                    showAuthor
                                />
                            ))}
                        </div>
                        <PaginationBar
                            page={postPage}
                            count={postsReady ? posts.count : 0}
                            label="posts"
                            setPage={setPostPage}
                        />
                    </>
                ) : searchQuery ? (
                    <p>No posts matching search query.</p>
                ) : (
                    <p>No public posts have been published in this project yet.</p>
                ) : (
                    <Skeleton count={1} className="h-64 md:w-1/3 sm:w-1/2 w-full"/>
                ) : (
                    <ProjectStats projectId={projectId}/>
                )}
                {!session && <InlineCTA/>}
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({ username: username });

        if (!thisUser) return { notFound: true };

        const thisProject = await ProjectModel.findOne({ userId: thisUser._id, urlName: projectUrlName });

        return { props: { projectData: cleanForJSON(thisProject), thisUser: cleanForJSON(thisUser), key: projectUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};