import React, {useState} from "react";
import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON, fetcher} from "../../../utils/utils";
import {
    DatedObj,
    PostObjGraph,
    ProjectObjWithPageStats,
    SnippetObj,
    SnippetObjGraph,
    UserObjWithProjects
} from "../../../utils/types";
import ProfileShell from "../../../components/ProfileShell";
import H1 from "../../../components/style/H1";
import H2 from "../../../components/style/H2";
import Masonry from "react-masonry-component";
import PostFeedItem from "../../../components/PostFeedItem";
import PaginationBar from "../../../components/PaginationBar";
import Skeleton from "react-loading-skeleton";
import useSWR, {responseInterface} from "swr";
import UpInlineButton from "../../../components/style/UpInlineButton";
import UpSEO from "../../../components/up-seo";
import Tabs from "../../../components/Tabs";
import ActivityTabs from "../../../components/ActivityTabs";
import ProjectDashboardDropdown from "../../../components/ProjectDashboardDropdown";
import {useSession} from "next-auth/client";
import {format} from "date-fns";
import SnippetItem from "../../../components/snippet-item";
import PublicPostItem from "../../../components/public-post-item";
import SnippetItemCard from "../../../components/SnippetItemCard";
import PostItemCard from "../../../components/PostItemCard";
import SnippetItemCardReadOnly from "../../../components/SnippetItemCardReadOnly";
import Link from "next/link";
import ProjectSnippetBrowser from "../../../components/ProjectSnippetBrowser";

export default function ProjectPage({projectData, thisUser}: { projectData: DatedObj<ProjectObjWithPageStats>, thisUser: DatedObj<UserObjWithProjects>}) {
    const [session, loading] = useSession();
    const [postPage, setPostPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [tab, setTab] = useState<"posts" | "snippets" | "stats">("posts");
    const [snippetPage, setSnippetPage] = useState<number>(1);

    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${projectData._id}&page=${postPage}&search=${searchQuery}`, fetcher);
    const {data: snippets, error: snippetsError}: responseInterface<{ snippets: DatedObj<SnippetObjGraph>[], count: number }, any> = useSWR(`/api/snippet?projectId=${projectData._id}&page=${snippetPage}&public=true`, fetcher);

    const postsReady = posts && posts.posts;
    const snippetsReady = snippets && snippets.snippets;

    const isOwner = session && session.userId === projectData.userId;

    return (
        <ProfileShell thisUser={thisUser} selectedProjectId={projectData._id}>
            <UpSEO title={projectData.name}/>
            <div className="items-center mb-8 hidden lg:flex">
                <UpInlineButton href={`/@${thisUser.username}`} light={true}>
                    {thisUser.name}
                </UpInlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <div className="flex items-center">
                    <H1>{projectData.name}</H1>
                    {isOwner && <ProjectDashboardDropdown projectId={projectData._id} className="ml-2"/>}
                </div>
                {projectData.description && (
                    <H2 className="mt-2">{projectData.description}</H2>
                )}
            </div>
            <Tabs tabInfo={[
                {
                    name: "posts",
                    text: `Posts (${postsReady ? posts.count : "loading..."})`,
                },
                {
                    name: "snippets",
                    text: `Snippets (${snippetsReady ? snippets.count : "loading..."})`,
                },
                {
                    name: "stats",
                    text: "Stats",
                },
            ]} tab={tab} setTab={setTab}/>
            {{
                posts: postsReady ? posts.posts.length ?(
                    <>
                        <Masonry className="md:-mx-8 w-full" options={{transitionDuration: 0}}>
                            {posts.posts.map((post, i) => <PostFeedItem post={post} key={post._id} i={i}/>)}
                        </Masonry>
                        <PaginationBar
                            page={postPage}
                            count={postsReady ? posts.count : 0}
                            label="posts"
                            setPage={setPostPage}
                            className="mb-12"
                        />
                    </>
                ) : searchQuery ? (
                    <p>No posts matching search query.</p>
                ) : (
                    <p>No public posts have been published in this project yet.</p>
                ) : (
                    <Skeleton count={1} className="h-32 w-full mt-12"/>
                ), snippets: (
                    <ProjectSnippetBrowser
                        snippets={snippets}
                        snippetPage={snippetPage}
                        setSnippetPage={setSnippetPage}
                        isOwner={isOwner}
                        projectId={projectData._id}
                    />
                ), stats: (
                    <ActivityTabs
                        snippetsArr={projectData.snippetsArr}
                        postsArr={projectData.postsArr}
                        linkedSnippetsArr={projectData.linkedSnippetsArr}
                    />
                )
            }[tab]}
        </ProfileShell>
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

        const userArr = await UserModel.aggregate([
            {$match: {username: username}},
            {$lookup:
                    {
                        from: "projects",
                        foreignField: "userId",
                        localField: "_id",
                        as: "projectsArr",
                    }
            },
        ]);

        if (!userArr.length) return { notFound: true };

        const thisUser = userArr[0];

        const projectData = await ProjectModel.aggregate([
            {$match: {userId: thisUser._id, urlName: projectUrlName }},
            {
                $lookup: {
                    from: "posts",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "postsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [
                                        {$eq: ["$projectId", "$$projectId"]},
                                        {$ne: ["$linkedPosts", []]},
                                    ]}}},
                        {$count: "count"},
                    ],
                    as: "linkedSnippetsArr",
                }
            },
        ]);

        if (!projectData.length) return { notFound: true };

        return { props: { projectData: cleanForJSON(projectData[0]), thisUser: cleanForJSON(thisUser), key: projectUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};