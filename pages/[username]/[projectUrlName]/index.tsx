import React, {useState} from "react";
import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON, fetcher} from "../../../utils/utils";
import {DatedObj, PostObjGraph, ProjectObj} from "../../../utils/types";
import {UserObjWithProjects} from "../index";
import ProfileShell from "../../../components/ProfileShell";
import H1 from "../../../components/style/H1";
import H2 from "../../../components/style/H2";
import Masonry from "react-masonry-component";
import PostFeedItem from "../../../components/PostFeedItem";
import PaginationBar from "../../../components/PaginationBar";
import Skeleton from "react-loading-skeleton";
import useSWR, {responseInterface} from "swr";
import UpInlineButton from "../../../components/style/UpInlineButton";
import {FiArrowLeft} from "react-icons/fi";
import UpSEO from "../../../components/up-seo";

export default function ProjectPage({projectData, thisUser}: { projectData: DatedObj<ProjectObj>, thisUser: DatedObj<UserObjWithProjects>}) {
    const [postPage, setPostPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [tab, setTab] = useState<"posts" | "snippets" | "stats">("posts");

    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${projectData ? projectData._id : "featured"}&page=${postPage}&search=${searchQuery}`, fetcher);

    const postsReady = posts && posts.posts;
    
    return (
        <ProfileShell thisUser={thisUser} selectedProjectId={projectData._id}>
            <UpSEO title={projectData.name}/>
            {/*<UpInlineButton href={`/@${thisUser.username}`} className="inline-flex items-center mb-8">*/}
            {/*    <FiArrowLeft/>*/}
            {/*    <span className="ml-2">*/}
            {/*        Back to profile*/}
            {/*    </span>*/}
            {/*</UpInlineButton>*/}
            <div className="flex items-center mb-8">
                <UpInlineButton href={`/@${thisUser.username}`} light={true}>
                    {thisUser.name}
                </UpInlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <H1>{projectData.name}</H1>
            {projectData.description && (
                <H2 className="mt-2">{projectData.description}</H2>
            )}
            {postsReady ? posts.posts.length ?(
                <>
                    <Masonry className="mt-12 -mx-8 w-full" options={{transitionDuration: 0}}>
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
            )}
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

        const projectData = await ProjectModel.findOne({ userId: thisUser._id, urlName: projectUrlName });

        return { props: { projectData: cleanForJSON(projectData), thisUser: cleanForJSON(thisUser), key: projectUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};