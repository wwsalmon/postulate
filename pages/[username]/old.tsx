import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {arrGraphGenerator, arrToDict, cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, PostObjGraph, ProjectObjWithCounts, UserObj} from "../../utils/types";
import UpSEO from "../../components/up-seo";
import React, {Dispatch, SetStateAction, useState} from "react";
import {format} from "date-fns";
import useSWR, {responseInterface} from "swr";
import PublicPostItem from "../../components/public-post-item";
import Skeleton from "react-loading-skeleton";
import ProjectItem from "../../components/project-item";
import {useSession} from "next-auth/client";
import MoreMenu from "../../components/more-menu";
import MoreMenuItem from "../../components/more-menu-item";
import {FiEdit, FiEdit2, FiGrid, FiMessageSquare, FiPlus, FiSearch, FiStar, FiX} from "react-icons/fi";
import Link from "next/link";
import Linkify from "react-linkify";
import UpBanner from "../../components/UpBanner";
import GitHubCalendar from "react-github-contribution-calendar/lib";
import ReactFrappeChart from "../../components/frappe-chart";
import UpModal from "../../components/up-modal";
import ProfileAddFeaturedPost from "../../components/profile-add-featured-post";
import axios from "axios";
import ProjectBrowser from "../../components/project-browser";

interface DatedUserObjWithCounts extends DatedObj<UserObj> {
    snippetsArr: {createdAt: string}[],
    postsArr: {createdAt: string}[],
    linkedSnippetsArr: {count: number}[],
}

export default function UserProfile({thisUser}: { thisUser: DatedUserObjWithCounts }) {
    const [session, loading] = useSession();
    const [tag, setTag] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [addPostOpen, setAddPostOpen] = useState<boolean>(false);
    const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);
    const [featuredPostsIter, setFeaturedPostsIter] = useState<number>(0);
    const [featuredProjectsIter, setFeaturedProjectsIter] = useState<number>(0);
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?userId=${thisUser._id}&tag=${tag}&page=${page}&search=${searchQuery}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{ projects: DatedObj<ProjectObjWithCounts>[], owners: DatedObj<UserObj>[] }, any> = useSWR(`/api/project?userId=${thisUser._id}&iter=${featuredProjectsIter}`, fetcher);
    const {data: featuredPosts, error: featuredPostsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?userId=${thisUser._id}&featured=true&iter=${featuredPostsIter}`);
    const {data: tags, error: tagsError}: responseInterface<{ data: any }, any> = useSWR(`/api/tag?userId=${thisUser._id}`, fetcher);
    const [statsTab, setStatsTab] = useState<"posts" | "snippets" | "graph">("posts");

    const postsReady = posts && posts.posts;
    const featuredPostsReady = featuredPosts && featuredPosts.posts;
    const featuredProjectsReady = projects && projects.projects;
    const isOwner = session && session.userId === thisUser._id;

    const snippetDates = arrToDict(thisUser.snippetsArr);
    const postDates = arrToDict(thisUser.postsArr);
    const snippetsCount = thisUser.snippetsArr ? thisUser.snippetsArr.length : 0;
    const postsCount = thisUser.postsArr ? thisUser.postsArr.length : 0;
    const numLinkedSnippets = !!thisUser.linkedSnippetsArr.length ? thisUser.linkedSnippetsArr[0].count : 0;
    const percentLinked = numLinkedSnippets ? Math.round(numLinkedSnippets / snippetsCount * 100) : 0;
    const numGraphDays = 30;

    const featuredPostIds = featuredPostsReady ? featuredPosts.posts.map(d => d._id) : [];
    const featuredProjectIds = featuredProjectsReady ? projects.projects.map(d => d._id) : [];

    function deleteFeaturedPost(id: string) {
        axios.delete(`/api/post/feature`, {
            data: {
                id: id,
            },
        }).then(() => {
            setFeaturedPostsIter(featuredPostsIter + 1);
        }).catch(e => {
            console.log(e);
        });
    }

    function deleteFeaturedProject(id: string) {
        axios.delete(`/api/project/feature`, {
            data: {
                id: id,
            },
        }).then(() => {
            setFeaturedProjectsIter(featuredProjectsIter + 1);
        }).catch(e => {
            console.log(e);
        });
    }

    function onSubmitFeaturedProject(selectedProjectId: string, setIsLoading: Dispatch<SetStateAction<boolean>>){
        setIsLoading(true);

        axios.post(`/api/project/feature`, {id: selectedProjectId}).then(() => {
            setIsLoading(false);
            setFeaturedProjectsIter(featuredProjectsIter + 1);
            setAddProjectOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

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
                    {tags && !!tags.data.length && (
                        <>
                            <hr className="my-8"/>
                            <h3 className="up-ui-title mb-4">Tags</h3>
                            {tags.data.map(tag => (
                                <button className="opacity-50 hover:opacity-100 transition mr-3" onClick={() => setTag(tag._id)}>#{tag._id} ({tag.count})</button>
                            ))}
                        </>
                    )}
                    <hr className="my-8"/>
                    <h3 className="up-ui-title mb-4">Activity</h3>
                    <div className="flex items-center">
                        <button
                            className={`flex items-center mr-6 transition pb-2 border-b-2 ${statsTab === "posts" ? "font-bold border-black opacity-75" : "opacity-25 hover:opacity-75 border-transparent"}`}
                            onClick={() => setStatsTab("posts")}
                        >
                            <FiEdit/>
                            <p className="ml-2">{postsCount} posts</p>
                        </button>
                        <button
                            className={`flex items-center mr-6 transition pb-2 border-b-2 ${statsTab === "snippets" ? "font-bold border-black opacity-75" : "opacity-25 hover:opacity-75 border-transparent"}`}
                            onClick={() => setStatsTab("snippets")}
                        >
                            <FiMessageSquare/>
                            <p className="ml-2">{snippetsCount} snippets</p>
                        </button>
                        <button
                            className={`flex items-center mr-6 transition pb-2 border-b-2 ${statsTab === "graph" ? "font-bold border-black opacity-75" : "opacity-25 hover:opacity-75 border-transparent"}`}
                            onClick={() => setStatsTab("graph")}
                        >
                            {percentLinked}% linked
                        </button>
                    </div>
                    <div className="my-8">
                        {(statsTab === "snippets" || statsTab === "posts") && (
                            <>
                                {/*
                                // @ts-ignore*/}
                                <GitHubCalendar
                                    panelColors={[
                                        "#eeeeee",
                                        "#ccd4ff",
                                        "#99a8ff",
                                        "#667dff",
                                        "#3351ff",
                                        ...Array(50).fill("#0026ff"),
                                    ]}
                                    values={{snippets: snippetDates, posts: postDates}[statsTab]}
                                    until={format(new Date(), "yyyy-MM-dd")}
                                />
                            </>
                        )}
                        {statsTab === "graph" && (
                            <ReactFrappeChart
                                type="line"
                                colors={["#ccd4ff", "#0026ff"]}
                                axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                                lineOptions={{ regionFill: 1, hideDots: 1 }}
                                height={250}
                                animate={false}
                                data={{
                                    labels: Array(numGraphDays).fill(0).map((d, i) => {
                                        const currDate = new Date();
                                        const thisDate = +currDate - (1000 * 24 * 3600) * (numGraphDays - 1 - i);
                                        return format(new Date(thisDate), "M/d");
                                    }),
                                    datasets: [
                                        {
                                            name: "Snippets",
                                            values: arrGraphGenerator(snippetDates, numGraphDays),
                                        },
                                        {
                                            name: "Posts",
                                            values: arrGraphGenerator(postDates, numGraphDays),
                                        },
                                    ],
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="lg:w-2/3 lg:pl-12">
                    <hr className="my-10 lg:hidden"/>
                    <div className="flex mb-8 items-center">
                        <div className="mr-4">
                            <FiGrid/>
                        </div>
                        <h3 className="up-ui-title">Featured projects</h3>
                        {isOwner && (
                            <>
                                <button className="ml-auto up-button small text" onClick={() => setAddProjectOpen(true)} disabled={!featuredProjectsReady}>
                                    <FiPlus/>
                                </button>
                                <UpModal isOpen={addProjectOpen} setIsOpen={setAddProjectOpen} wide={true}>
                                    <h3 className="up-ui-title mb-4">Select a project to feature</h3>
                                    <ProjectBrowser
                                        setOpen={setAddProjectOpen}
                                        featuredProjectIds={featuredProjectIds}
                                        buttonText="Add"
                                        onSubmit={onSubmitFeaturedProject}
                                    />
                                </UpModal>
                            </>
                        )}
                    </div>
                    {(projects && projects.projects && projects.owners) ? projects.projects.length === 0 ? (
                        <p className="opacity-50">No featured projects. {isOwner ? "Go to a project and press \"Display project on profile\" to feature a project." : ""}</p>
                    ) : (
                        <div className="-mx-2 flex-wrap md:flex">
                            {projects.projects.map(project => (
                                <ProjectItem
                                    project={project}
                                    owners={projects.owners}
                                    sessionUserId={thisUser._id}
                                    unpinProject={() => deleteFeaturedProject(project._id)}
                                    isOwner={isOwner}
                                />
                            ))}
                        </div>
                    ) : (
                        <Skeleton count={10}/>
                    )}
                    <hr className="my-10"/>
                    <div className="flex mb-8 items-center">
                        <div className="mr-4">
                            <FiStar/>
                        </div>
                        <h3 className="up-ui-title">Featured posts</h3>
                        {isOwner && (
                            <>
                                <button className="ml-auto up-button small text" onClick={() => setAddPostOpen(true)} disabled={!featuredPostsReady}>
                                    <FiPlus/>
                                </button>
                                <UpModal isOpen={addPostOpen} setIsOpen={setAddPostOpen} wide={true}>
                                    <ProfileAddFeaturedPost
                                        iteration={featuredPostsIter}
                                        setIteration={setFeaturedPostsIter}
                                        thisUser={thisUser}
                                        setOpen={setAddPostOpen}
                                        featuredPostIds={featuredPostIds}
                                    />
                                </UpModal>
                            </>
                        )}
                    </div>
                    {featuredPostsReady && featuredPosts.posts.length ? (
                        <>
                            {featuredPosts.posts.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(post => (
                                <>
                                    <div className="flex items-center">
                                        {isOwner && (
                                            <button
                                                className="up-button text small opacity-25 hover:opacity-100 mr-4"
                                                onClick={() => deleteFeaturedPost(post._id)}
                                            >
                                                <FiX/>
                                            </button>
                                        )}
                                        <PublicPostItem
                                            post={post}
                                            showProject={true}
                                            showLine={false}
                                        />
                                    </div>
                                    <hr className="my-10"/>
                                </>
                            ))}
                            <hr className="my-6 invisible"/>
                        </>
                    ) : (
                        <>
                            <p className="opacity-50">{isOwner ? "Press the + button to feature a post." : "This user has not featured any posts."}</p>
                            <hr className="my-10"/>
                        </>
                    )}
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
                    <div className="flex items-center mb-8">
                        {isSearch ? (
                            <input
                                type="text"
                                className="border-b py-2 flex-grow w-full"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={e => {
                                    setPage(1);
                                    setSearchQuery(e.target.value);
                                }}
                            />
                        ) : (
                            <h3 className="up-ui-title">Public posts ({postsReady ? !!posts.count ? <>showing {(page - 1) * 10 + 1}
                                -{(page < Math.floor(posts.count / 10)) ? page * 10 : posts.count} of {posts.count}</> : 0 : "Loading..."})</h3>
                        )}
                        <div className="ml-auto">
                            <button className="up-button text small" onClick={() => {
                                if (isSearch) setSearchQuery("");
                                setIsSearch(!isSearch)
                            }}>
                                {isSearch ? (
                                    <FiX/>
                                ) : (
                                    <FiSearch/>
                                )}
                            </button>
                        </div>
                    </div>

                    {isSearch && postsReady && (
                        <p className="opacity-25 mb-12 -mt-4">
                            Showing posts {(page - 1) * 10 + 1}
                            -{(page < Math.floor(posts.count / 10)) ? page * 10 : posts.count} of {posts.count}
                        </p>
                    )}

                    {postsReady ? posts.posts.length > 0 ? (
                        <>
                            {posts.posts.map(post => (
                                <PublicPostItem
                                    post={post}
                                    showProject={true}
                                />
                            ))}
                            
                            {posts.count > 10 && (
                                <>
                                    <p className="opacity-25 mt-8">
                                        Showing posts {(page - 1) * 10 + 1}
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
                        <p>No public posts have been published by this user yet.</p>
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

        const graphObj = await UserModel.aggregate([
            {$match: {username: username}},
            {
                $lookup: {
                    from: "posts",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "postsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [
                            {$eq: ["$userId", "$$userId"]},
                            {$ne: ["$linkedPosts", []]},
                        ]}}},
                        {$count: "count"},
                    ],
                    as: "linkedSnippetsArr",
                }
            }
        ]);

        if (!graphObj.length) return { notFound: true };

        return { props: { thisUser: cleanForJSON(graphObj[0]), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}