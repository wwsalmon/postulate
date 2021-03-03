import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, PostObj, ProjectObj, UserObj} from "../../utils/types";
import UpSEO from "../../components/up-seo";
import React from "react";
import BackToProjects from "../../components/back-to-projects";
import {format} from "date-fns";
import useSWR, {responseInterface} from "swr";
import PublicPostItem from "../../components/public-post-item";
import Skeleton from "react-loading-skeleton";
import InlineCTA from "../../components/inline-cta";

export default function UserProfile({thisUser}: { thisUser: DatedObj<UserObj> }) {
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObj>[], projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/post?userId=${thisUser._id}`, fetcher);

    console.log(posts);

    const postsReady = posts && posts.posts && posts.projects;
    const filteredPosts = postsReady ? posts.posts.filter(post => post.privacy === "public") : [];

    return (
        <div className="max-w-7xl mx-auto px-4 pb-16">
            <UpSEO title={thisUser.name + "'s profile"}/>
            <div className="lg:flex">
                <div className="lg:w-1/3 lg:pr-8 lg:border-r">
                    <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-20 h-20 rounded-full"/>
                    <h1 className="up-h1 mt-6">{thisUser.name}</h1>
                    <p className="opacity-50 mt-4">Bio of {thisUser.name}</p>
                    <p className="opacity-25 mt-2">Joined Postulate on {format(new Date(thisUser.createdAt), "MMMM d, yyyy")}</p>
                </div>
                <div className="lg:w-2/3 lg:pl-8">
                    {postsReady ? filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <PublicPostItem
                            post={post}
                            author={thisUser}
                            project={posts.projects.find(d => d._id === post.projectId)}
                            urlPrefix={`/@${thisUser.username}/${posts.projects.find(d => d._id === post.projectId).urlName}`}
                        />
                    )) : (
                        <p>No public posts have been published in this project yet.</p>
                    ) : (
                        <Skeleton count={1} className="h-64 md:w-1/3 sm:w-1/2 w-full"/>
                    )}
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);

    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({ username: username });

        if (!thisUser) return { notFound: true };

        return { props: { thisUser: cleanForJSON(thisUser), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}