import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, PostObj, ProjectObj, ProjectObjWithCounts, UserObj} from "../../utils/types";
import UpSEO from "../../components/up-seo";
import React, {useState} from "react";
import {format} from "date-fns";
import useSWR, {responseInterface} from "swr";
import PublicPostItem from "../../components/public-post-item";
import Skeleton from "react-loading-skeleton";
import ProjectItem from "../../components/project-item";
import {useSession} from "next-auth/client";
import MoreMenu from "../../components/more-menu";
import MoreMenuItem from "../../components/more-menu-item";
import {FiEdit2} from "react-icons/fi";
import Link from "next/link";
import Linkify from "react-linkify";
import UpBanner from "../../components/UpBanner";

export default function UserProfile({thisUser}: { thisUser: DatedObj<UserObj> }) {
    const [session, loading] = useSession();
    const [tag, setTag] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObj>[], count: number, projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] }, any> = useSWR(`/api/post?userId=${thisUser._id}&tag=${tag}&page=${page}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{ projects: DatedObj<ProjectObjWithCounts>[], owners: DatedObj<UserObj>[] }, any> = useSWR(`/api/project?userId=${thisUser._id}`, fetcher);
    const {data: tags, error: tagsError}: responseInterface<{ data: any }, any> = useSWR(`/api/tag?userId=${thisUser._id}`, fetcher);

    const postsReady = posts && posts.posts && posts.projects && posts.owners;
    const filteredPosts = postsReady ? posts.posts.filter(post => post.privacy === "public") : [];
    const isOwner = session && session.userId === thisUser._id;

    return (
        <div className="max-w-7xl mx-auto px-4 pb-16">
            <UpSEO title={thisUser.name + "'s profile"}/>
            <div className="lg:flex">
                <div className="lg:w-1/3 lg:pr-12 lg:border-r">
                    <div className="flex">
                        <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-20 h-20 rounded-full"/>
                        {session && session.userId === thisUser._id && (
                            <div className="ml-auto">
                                <MoreMenu>
                                    <MoreMenuItem text="Edit" icon={<FiEdit2/>} href={`/@${thisUser.username}/edit`}/>
                                </MoreMenu>
                            </div>
                        )}
                    </div>
                    <h1 className="up-h1 mt-6">{thisUser.name}</h1>
                    {thisUser.bio ? (
                        <p className="mt-4 prose">
                            <Linkify>{thisUser.bio}</Linkify>
                        </p>
                    ) : (isOwner && (
                        <p className="mt-4 opacity-50"><Link href={`/@${thisUser.username}/edit`}><a className="underline">Edit your profile</a></Link> to add a bio.</p>
                    ))}
                    <p className="opacity-25 mt-2">Joined Postulate on {format(new Date(thisUser.createdAt), "MMMM d, yyyy")}</p>
                    {tags && tags.data.length && (
                        <>
                            <hr className="my-8"/>
                            <h3 className="up-ui-title mb-4">Tags</h3>
                            {tags.data.map(tag => (
                                <button className="opacity-50 hover:opacity-100 transition mr-3" onClick={() => setTag(tag._id)}>#{tag._id} ({tag.count})</button>
                            ))}
                        </>
                    )}

                </div>
                <div className="lg:w-2/3 lg:pl-12">
                    <hr className="my-10 lg:hidden"/>
                    <h3 className="up-ui-title mb-8">Featured projects</h3>
                    {(projects && projects.projects && projects.owners) ? projects.projects.length === 0 ? (
                        <p className="opacity-50">No featured projects. {isOwner ? "Go to a project and press \"Display project on profile\" to feature a project." : ""}</p>
                    ) : (
                        <div className="-mx-2 flex-wrap md:flex">
                            {projects.projects.map(project => (
                                <ProjectItem project={project} owners={projects.owners} sessionUserId={thisUser._id}/>
                            ))}
                        </div>
                    ) : (
                        <Skeleton count={10}/>
                    )}
                    <hr className="my-10"/>
                    {tag && (
                        <UpBanner className="mb-8">
                            <div className="md:flex items-center w-full">
                                <p>Showing posts with the tag <b>#{tag}</b></p>
                                <button className="up-button text ml-auto" onClick={() => {
                                    setTag("");
                                    setPage(1);
                                }}>Clear</button>
                            </div>
                        </UpBanner>
                    )}
                    <h3 className="up-ui-title mb-8">Public posts (showing {postsReady ? <>{(page - 1) * 10 + 1}
                        -{(page < Math.floor(posts.count / 10)) ? page * 10 : posts.count} of {posts.count}</> : "Loading..."})</h3>
                    {postsReady ? filteredPosts.length > 0 ? (
                        <>
                            {filteredPosts.map(post => (
                                <PublicPostItem
                                    post={post}
                                    author={thisUser}
                                    project={posts.projects.find(d => d._id === post.projectId)}
                                    urlPrefix={`/@${posts.owners.find(d => d._id === posts.projects.find(d => d._id === post.projectId).userId).username}/${posts.projects.find(d => d._id === post.projectId).urlName}`}
                                />
                            ))}
                            
                            {posts.count > 10 && (
                                <>
                                    <p className="opacity-25 mt-8">
                                        Showing snippets {(page - 1) * 10 + 1}
                                        -{(page < Math.floor(posts.count / 10)) ? page * 10 : posts.count} of {posts.count}
                                    </p>
                                    <div className="mt-4">
                                        {Array.from({length: Math.ceil(posts.count / 10)}, (x, i) => i + 1).map(d => (
                                            <button
                                                className={"py-2 px-4 rounded-md mr-2 " + (d === page ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                                                onClick={() => setPage(d)}
                                                disabled={+d === +page}
                                            >{d}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
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