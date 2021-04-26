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

export default function Project(props: {projectData: DatedObj<ProjectObj>, thisUser: DatedObj<UserObj>}) {
    const [session, loading] = useSession();
    const [{_id: projectId, userId, name, description, urlName, createdAt, stars, collaborators, availableTags }, setProjectData] = useState<DatedObj<ProjectObj>>(props.projectData);

    const isOwner = session && session.userId === userId;
    const isCollaborator = session && props.projectData.collaborators.includes(session.userId);
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${projectId}`, fetcher);

    const postsReady = posts && posts.posts;
    const filteredPosts = postsReady ? posts.posts.filter(post => post.privacy === "public") : [];

    return (
        <>
            <UpSEO title={props.projectData.name} description={props.projectData.description}/>
            <div className="max-w-4xl mx-auto px-4">
                {(isOwner || isCollaborator) && (
                    <UpBanner>
                        <div className="md:flex items-center w-full">
                            <p>You're viewing this project as a public visitor would see it.</p>
                            <Link href={`/projects/${projectId}`}>
                                <a className="up-button text small ml-auto">Back</a>
                            </Link>
                        </div>
                    </UpBanner>
                )}
                <div className="flex items-center">
                    <div>
                        <h1 className="up-h1 mt-8 mb-2">{name}</h1>
                        <p className="up-h2">{description}</p>
                        <div className="flex items-center my-8">
                            <Link href={`/@${props.thisUser.username}`}>
                                <a>
                                    <img src={props.thisUser.image} alt={`Profile picture of ${props.thisUser.name}`} className="w-10 h-10 rounded-full mr-4"/>
                                </a>
                            </Link>
                            <div>
                                <Link href={`/@${props.thisUser.username}`}>
                                    <a className="font-bold">
                                        {props.thisUser.name}
                                    </a>
                                </Link>
                                <p className="opacity-50">Project owner</p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-8"/>
                <p className="up-ui-title mb-12 opacity-50">Public posts ({posts ? filteredPosts.length : "Loading..."})</p>
                {postsReady ? filteredPosts.length > 0 ? filteredPosts.map(post => (
                    <PublicPostItem
                        post={post}
                        showAuthor
                    />
                )) : (
                    <p>No public posts have been published in this project yet.</p>
                ) : (
                    <Skeleton count={1} className="h-64 md:w-1/3 sm:w-1/2 w-full"/>
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