import {DatedObj, PostObjGraph, ProjectObj} from "../../utils/types";
import {UserObjWithProjects} from "../../pages/[username]";
import H3 from "../style/H3";
import Link from "next/link";
import ProfileFeatured from "./ProfileFeatured";
import Linkify from "react-linkify";
import H1 from "../style/H1";
import React, {useState} from "react";
import UpSEO from "../up-seo";
import H2 from "../style/H2";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../../utils/utils";
import Skeleton from "react-loading-skeleton";
import PaginationBar from "../PaginationBar";
import PostFeedItem from "../PostFeedItem";
import Masonry from "react-masonry-component";

interface ProfileProjectPropsBase {
   thisUser: DatedObj<UserObjWithProjects>,
}

interface ProfileProjectPropsFeatured extends ProfileProjectPropsBase {
    featured: true,
    thisProject?: never,
}

interface ProfileProjectPropsProject extends ProfileProjectPropsBase {
    featured?: never | false,
    thisProject: DatedObj<ProjectObj>,
}

type ProfileProjectProps = ProfileProjectPropsFeatured | ProfileProjectPropsProject;

export default function ProfileProject({thisUser, thisProject, featured}: ProfileProjectProps) {
    const [postPage, setPostPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [tab, setTab] = useState<"posts" | "snippets" | "stats">("posts");

    const featuredProjects = thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id));
    const selectedProjectId = featured ? "featured" : thisProject._id;

    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${thisProject ? thisProject._id : "featured"}&page=${postPage}&search=${searchQuery}`, fetcher);

    const postsReady = posts && posts.posts;

    return (
        <>
            <UpSEO title={thisProject ? thisProject.name : "Featured"} description={thisProject ? thisProject.description : null}/>
            <div className="up-bg-gray-50 w-1/2 absolute left-0 top-0 h-full z-0"/>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex">
                    <div className="w-80 up-bg-gray-50 -my-8 h-full pt-12 border-r up-border-gray-200" style={{minHeight: "calc(100vh - 64px)"}}>
                        <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-12 h-12 rounded-full"/>
                        <H3 className="my-4">{thisUser.name}</H3>
                        <p className="up-gray-400 mb-12"><Linkify>{thisUser.bio}</Linkify></p>
                        <Link href={`/@${thisUser.username}`}>
                            <a
                                className={(featured ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                                style={{
                                    right: -1,
                                    paddingLeft: featured ? "calc(1rem - 1px)" : 0,
                                    width: featured ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                                }}
                            >
                                Home
                            </a>
                        </Link>
                        {featuredProjects.map(project => (
                            <Link href={`/@${thisUser.username}/${project.urlName}`}>
                                <a
                                    className={(project._id === selectedProjectId ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                                    style={{
                                        right: -1,
                                        paddingLeft: project._id === selectedProjectId ? "calc(1rem - 1px)" : 0,
                                        width: project._id === selectedProjectId ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                                    }}
                                >
                                    {project.name}
                                </a>
                            </Link>
                        ))}
                    </div>
                    <div className="pl-12 w-full bg-white h-full -my-8 pt-12" style={{minHeight: "calc(100vh - 64px)"}}>
                        {featured ? (
                            <ProfileFeatured thisUser={thisUser}/>
                        ) : (
                            <>
                                <H1>{thisProject.name}</H1>
                                {thisProject.description && (
                                    <H2 className="mt-2">{thisProject.description}</H2>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}