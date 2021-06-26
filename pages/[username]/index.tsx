import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, PostObjGraph, ProjectObj, UserObj} from "../../utils/types";
import React, {useState} from "react";
import ProfileShell from "../../components/ProfileShell";
import H1 from "../../components/style/H1";
import H2 from "../../components/style/H2";
import H4 from "../../components/style/H4";
import Link from "next/link";
import H3 from "../../components/style/H3";
import useSWR, {responseInterface} from "swr";
import Masonry from "react-masonry-component";
import PostFeedItem from "../../components/PostFeedItem";
import PaginationBar from "../../components/PaginationBar";
import UpSEO from "../../components/up-seo";

export interface UserObjWithProjects extends UserObj {
    projectsArr: DatedObj<ProjectObj>[],
}

export default function UserProfile({thisUser}: { thisUser: DatedObj<UserObjWithProjects> }) {
    const [tag, setTag] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const featuredProjects = thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id));

    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?userId=${thisUser._id}&tag=${tag}&page=${page}&search=${searchQuery}`, fetcher);

    return (
        <ProfileShell thisUser={thisUser} featured={true}>
            <UpSEO title={`${thisUser.name}`}/>
            <H1>Welcome to {thisUser.name.split(" ")[0]}'s Postulate</H1>
            <H2 className="mt-2">Repositories of open-sourced knowledge</H2>
            <H4 className="mt-12 mb-8">Featured repositories</H4>
            <div className="grid grid-cols-4 gap-4">
                {featuredProjects.map(project => (
                    <div className="p-4 shadow-sm rounded-md border hover:shadow-md transition cursor-pointer">
                        <Link href={"/@" + thisUser.username + "/" + project.urlName}>
                            <a>
                                <H3 className="mb-2">{project.name}</H3>
                                <p className="break-words up-gray-400">{project.description}</p>
                            </a>
                        </Link>
                    </div>
                ))}
            </div>
            <hr className="my-16"/>
            <H4 className="mb-8">Latest posts</H4>
            <Masonry className="mt-12 -mx-8 w-full" options={{transitionDuration: 0}}>
                {posts && posts.posts && posts.posts.map((post, i) => <PostFeedItem post={post} key={post._id} i={i}/>)}
            </Masonry>
            <PaginationBar
                page={page}
                count={(posts && posts.posts) ? posts.count : 0}
                label="posts"
                setPage={setPage}
                className="mb-12"
            />
        </ProfileShell>
    )
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

        const userObj = await UserModel.aggregate([
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

        if (!userObj.length) return { notFound: true };

        return { props: { thisUser: cleanForJSON(userObj[0]), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}