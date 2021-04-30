import {GetServerSideProps} from "next";
import {ProjectModel} from "../../models/project";
import {arrGraphGenerator, arrToDict, cleanForJSON, fetcher} from "../../utils/utils";
import {getSession, useSession} from "next-auth/client";
import {
    DatedObj,
    PostObj,
    PostObjGraph,
    ProjectObjWithGraph,
    SnippetObj,
    SnippetObjGraph,
    UserObj
} from "../../utils/types";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import useSWR, {responseInterface} from "swr";
import axios from "axios";
import UpSEO from "../../components/up-seo";
import MoreMenu from "../../components/more-menu";
import MoreMenuItem from "../../components/more-menu-item";
import {
    FiChevronDown, FiChevronUp,
    FiEdit,
    FiEdit2,
    FiExternalLink,
    FiEye,
    FiEyeOff,
    FiMessageSquare,
    FiTrash,
    FiUserPlus,
    FiX
} from "react-icons/fi";
import UpModal from "../../components/up-modal";
import SpinnerButton from "../../components/spinner-button";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Link from "next/link";
import {format} from "date-fns";
import SnippetItem from "../../components/snippet-item";
import {UserModel} from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import GitHubCalendar from "react-github-contribution-calendar/lib";
import ReactFrappeChart from "../../components/frappe-chart";
import EasyMDE from "easymde";
import ellipsize from "ellipsize";
import SnippetItemCard from "../../components/SnippetItemCard";
import UpBanner from "../../components/UpBanner";
import {HiViewGrid, HiViewList} from "react-icons/hi";
import NavbarQuickSnippetModal from "../../components/navbar-quick-snippet-modal";
import PublicPostItem from "../../components/public-post-item";
import PostItemCard from "../../components/PostItemCard";
import Mousetrap from "mousetrap";
import Accordion from "react-robust-accordion";
import ProjectStats from "../../components/ProjectStats";

export default function ProjectWorkspace(props: {projectData: DatedObj<ProjectObjWithGraph>, thisUser: DatedObj<UserObj>}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [isSnippet, setIsSnippet] = useState<boolean>(false);
    const [iteration, setIteration] = useState<number>(0);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [addCollaboratorOpen, setAddCollaboratorOpen] = useState<boolean>(false);
    const [addCollaboratorList, setAddCollaboratorList] = useState<{ value: string, label: string }[]>(null);
    const [addCollaboratorLoading, setAddCollaboratorLoading] = useState<boolean>(false);
    const [collaboratorIteration, setCollaboratorIteration] = useState<number>(null);
    const [orderNew, setOrderNew] = useState<boolean>(true);
    const [snippetSearchQuery, setSnippetSearchQuery] = useState<string>("");
    const [tagsQuery, setTagsQuery] = useState<string[]>([]);
    const [authorsQuery, setAuthorsQuery] = useState<string[]>([]);
    const [itemPage, setItemPage] = useState<number>(1);
    const [postPage, setPostPage] = useState<number>(1);
    const [snippetPage, setSnippetPage] = useState<number>(1);
    const [selectedSnippetIds, setSelectedSnippetIds] = useState<string[]>([]);
    const [statsTab, setStatsTab] = useState<"posts" | "snippets" | "graph">("posts");
    const [instance, setInstance] = useState<EasyMDE>(null);
    const [tab, setTab] = useState<"home"|"snippets"|"posts"|"stats">("home");
    const [linkedQuery, setLinkedQuery] = useState<"true"|"false"|"all">("all");
    const [statsIter, setStatsIter] = useState<number>(0);
    const [listView, setListView] = useState<boolean>(false);
    const [selectedSnippetsOpen, setSelectedSnippetsOpen] = useState<boolean>(false);

    const [{
        _id: projectId,
        userId,
        name,
        description,
        urlName,
        createdAt,
        stars,
        collaborators,
        availableTags,
    }, setProjectData] = useState<DatedObj<ProjectObjWithGraph>>(props.projectData);

    const isCollaborator = session && props.projectData.collaborators.includes(session.userId);
    const {data: items, error: itemsError}: responseInterface<{items: (DatedObj<SnippetObjGraph> | DatedObj<PostObjGraph>[]), count: number}, any> = useSWR(`/api/project/feed?projectId=${projectId}&page=${itemPage}&iteration=${iteration}`);
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObjGraph>[], count: number }, any> = useSWR(`/api/snippet?projectId=${projectId}&iter=${iteration}&search=${snippetSearchQuery}&tags=${encodeURIComponent(JSON.stringify(tagsQuery))}&userIds=${encodeURIComponent(JSON.stringify(authorsQuery))}&page=${snippetPage}&sort=${orderNew ? "-1" : "1"}&linked=${linkedQuery}`, fetcher);
    const {data: selectedSnippets, error: selectedSnippetsError}: responseInterface<{snippets: DatedObj<SnippetObjGraph>[], count: number }, any> = useSWR(`/api/snippet?ids=${encodeURIComponent(JSON.stringify(selectedSnippetIds))}`, fetcher);
    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?projectId=${projectId}&private=true&page=${postPage}&iteration=${iteration}`, fetcher);
    const {data: collaboratorObjs, error: collaboratorObjsError}: responseInterface<{collaborators: DatedObj<UserObj>[] }, any> = useSWR(`/api/project/collaborator?projectId=${projectId}&iter=${collaboratorIteration}`, fetcher);
    const {data: stats, error: statsError}: responseInterface<{ postDates: {createdAt: string}[], snippetDates: {createdAt: string}[], linkedSnippetsCount: number }, any> = useSWR(`/api/project/stats?projectId=${projectId}&iter=${statsIter}`);

    const itemsReady = items && items.items;
    const postsReady = posts && posts.posts;
    const snippetsReady = snippets && snippets.snippets;

    const displayItems = {
        home: itemsReady ? items.items : [],
        posts: postsReady ? posts.posts : [],
        snippets: snippetsReady ? snippets.snippets : [],
    }[tab];

    const displayReady = {
        home: itemsReady,
        posts: postsReady,
        snippets: snippetsReady,
    }[tab];

    const displayLabel = {
        home: "items",
        posts: "posts",
        snippets: "snippets",
    }[tab];

    const displayPage = {
        home: itemPage,
        posts: postPage,
        snippets: snippetPage,
    }[tab];

    const displayCount = {
        home: itemsReady ? items.count : 0,
        posts: postsReady ? posts.count : 0,
        snippets: snippetsReady ? snippets.count : 0,
    }[tab];

    const statsReady = stats && stats.postDates && stats.snippetDates;
    const numPosts = statsReady ? stats.postDates.length : 0;
    const numSnippets = statsReady ? stats.snippetDates.length : 0;
    const numLinkedSnippets = statsReady ? stats.linkedSnippetsCount : 0;
    const percentLinked = numLinkedSnippets ? Math.round(numLinkedSnippets / numSnippets * 100) : 0;

    const [projectIsFeatured, setProjectIsFeatured] = useState<boolean>(session && session.featuredProjects.includes(projectId));

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete("/api/project", {
            data: {
                id: projectId,
            },
        }).then(() => {
            router.push("/projects");
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    function onAddCollaborators() {
        setAddCollaboratorLoading(true);

        axios.post("/api/project/collaborator", {
            projectId: projectId,
            emails: addCollaboratorList.map(d => d.value),
        }).then(() => {
            setAddCollaboratorLoading(false);
            setAddCollaboratorList([]);
            setCollaboratorIteration(collaboratorIteration + 1);
        }).catch(e => {
            setAddCollaboratorLoading(false);
            console.log(e)
        });
    }

    function deleteCollaborator(id: string) {
        axios.delete("/api/project/collaborator", {
            data: {
                projectId: projectId,
                userId: id,
            }
        }).then(() => {
            setCollaboratorIteration(collaboratorIteration + 1);
        }).catch(e => {
            console.log(e);
        });
    }

    function addNewTags(newTags: string[]) {
        let newProjectData = {...props.projectData};
        newProjectData.availableTags = [...availableTags, ...newTags];
        setProjectData(newProjectData);
    }

    function toggleProjectFeatured() {
        axios.post("/api/project/feature", { id: projectId, addOrRemove: projectIsFeatured ? "remove" : "add" }).then(() => {
            setProjectIsFeatured(!projectIsFeatured);
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        function onNewSnippetShortcut(e) {
            e.preventDefault();
            setIsSnippet(true);
        };

        Mousetrap.bind("n", onNewSnippetShortcut);

        return () => {
            Mousetrap.unbind("n", onNewSnippetShortcut);
        };
    });

    const SearchControl = () => (
        <input
            type="text"
            className="border up-border-gray-200 h-10 lg:h-8 md:ml-2 rounded-md lg:text-sm px-2 up-bg-gray-100 up-gray-500 w-full lg:w-auto mb-4 lg:mb-0"
            placeholder="Search in project"
            value={snippetSearchQuery}
            onChange={e => {
                setSnippetPage(1);
                setSnippetSearchQuery(e.target.value);
            }}
        />
    );

    const TagControl = ({large}: { large: boolean }) => (
        <Select
            className="lg:text-sm up-gray-500 h-10 lg:h-8 lg:w-64 w-full"
            options={availableTags ? availableTags.map(d => ({label: d, value: d})) : []}
            value={tagsQuery.map(d => ({label: d, value: d}))}
            onChange={(newValue) => {
                setSnippetPage(1);
                setTagsQuery(newValue.map(d => d.value));
            }}
            placeholder="Filter by tag"
            styles={{
                control: (provided) => {
                    provided["height"] = !large ? "2rem" : "2.5rem";
                    provided["min-height"] = 0;
                    provided["background-color"] = "transparent";
                    provided["border-color"] = "#E4E4E7";
                    return provided;
                },
                indicatorsContainer: (provided) => {
                    provided["height"] = !large ? "2rem" : "2.5rem";
                    provided["min-height"] = 0;
                    return provided;
                },
                valueContainer: (provided) => {
                    provided["height"] = !large ? "2rem" : "2.5rem";
                    provided["min-height"] = 0;
                    return provided;
                },
            }}
            isMulti
        />
    );

    return (
        <>
            <UpSEO title={props.projectData.name} description={props.projectData.description}/>
            <div className="w-full up-bg-gray-50 -mt-8 border-t up-border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="md:flex items-center">
                        <div className="flex items-center w-full h-20">
                            <div className="md:flex items-center">
                                <h1 className="content font-bold mr-6">{props.projectData.name}</h1>
                                <p className="up-gray-400">{ellipsize(props.projectData.description, 45)}</p>
                            </div>
                            <div className="ml-auto md:mr-4">
                                <MoreMenu>
                                    <MoreMenuItem text="View as public" icon={<FiExternalLink/>} href={`/@${props.thisUser.username}/${urlName}`}/>
                                    {!isCollaborator && (
                                        <>
                                            <MoreMenuItem text="Edit" icon={<FiEdit2/>} href={`/@${props.thisUser.username}/${urlName}/edit`}/>
                                            <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
                                            <MoreMenuItem text="Add collaborators" icon={<FiUserPlus/>} onClick={() => setAddCollaboratorOpen(true)}/>
                                        </>
                                    )}
                                    {projectIsFeatured ? (
                                        <MoreMenuItem text="Don't display on profile" icon={<FiEyeOff/>} onClick={toggleProjectFeatured}/>
                                    ) : (
                                        <MoreMenuItem text="Display on profile" icon={<FiEye/>} onClick={toggleProjectFeatured}/>
                                    )}
                                </MoreMenu>
                                <UpModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}>
                                    <p>Are you sure you want to delete this project and all its snippets? This action cannot be undone.</p>
                                    <div className="flex mt-4">
                                        <SpinnerButton isLoading={isDeleteLoading} onClick={onDelete}>
                                            Delete
                                        </SpinnerButton>
                                        <button className="up-button text" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                                    </div>
                                </UpModal>
                                <UpModal isOpen={addCollaboratorOpen} setIsOpen={setAddCollaboratorOpen}>
                                    <h3 className="up-ui-title">Add collaborator</h3>
                                    <p>Collaborators are able to view and add snippets and posts in your project.</p>
                                    <AsyncSelect
                                        cacheOtions
                                        loadOptions={(input, callback) => {
                                            if (input) {
                                                axios.get(`/api/search/user?email=${input}`).then(res => {
                                                    const filteredResults = res.data.results.filter(d => ![
                                                        userId,
                                                        ...((collaboratorObjs && collaboratorObjs.collaborators) ? collaboratorObjs.collaborators.map(x => x._id.toString()) : [])
                                                    ].includes(d._id));
                                                    callback(filteredResults.map(user => ({label: user.name + ` (${user.email})`, value: user.email})))
                                                }).catch(e => {
                                                    console.log(e);
                                                });
                                            } else {
                                                callback([]);
                                            }
                                        }}
                                        placeholder="Enter collaborator's email"
                                        styles={{dropdownIndicator: () => ({display: "none"})}}
                                        onChange={selected => setAddCollaboratorList(selected)}
                                        isMulti
                                        value={addCollaboratorList}
                                        className="my-4 min-w-64"
                                    />
                                    <SpinnerButton isLoading={addCollaboratorLoading} onClick={onAddCollaborators} isDisabled={!addCollaboratorList || addCollaboratorList.length === 0}>
                                        Add
                                    </SpinnerButton>
                                    <hr className="my-4"/>
                                    <h3 className="up-ui-title">Manage collaborators</h3>
                                    {(collaboratorObjs && collaboratorObjs.collaborators) ? collaboratorObjs.collaborators.length > 0 ? (
                                        collaboratorObjs.collaborators.map(collaborator => (
                                            <div className="flex items-center my-4">
                                                <img src={collaborator.image} alt={collaborator.name} className="w-10 h-10 rounded-full mr-4"/>
                                                <p>{collaborator.name} ({collaborator.email})</p>
                                                <div className="ml-auto">
                                                    <MoreMenu>
                                                        <MoreMenuItem text="Remove" icon={<FiX/>} onClick={() => deleteCollaborator(collaborator._id)}/>
                                                    </MoreMenu>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No collaborators found for this project.</p>
                                    ) : (
                                        <div className="mt-4">
                                            <Skeleton count={2}/>
                                        </div>
                                    )}
                                </UpModal>
                            </div>
                        </div>
                        <div className="flex items-center flex-shrink-0 py-4 md:my-0">
                            <button className="up-button primary small mr-4" onClick={() => setIsSnippet(true)}>
                                <span>New snippet</span>
                                <span className="font-normal hidden sm:inline"> (n)</span>
                            </button>
                            <Link href={`/post/new?projectId=${projectId}&back=/projects/${projectId}`}>
                                <a className="up-button small">
                                    <div className="flex items-center">
                                        <FiEdit/>
                                        <span className="ml-4">New post</span>
                                    </div>
                                </a>
                            </Link>
                            <UpModal isOpen={isSnippet} setIsOpen={setIsSnippet} wide={true}>
                                <NavbarQuickSnippetModal
                                    setOpen={setIsSnippet}
                                    initProjectId={projectId}
                                    iteration={iteration}
                                    setIteration={setIteration}
                                />
                            </UpModal>
                        </div>
                    </div>
                </div>
            </div>
            {!!selectedSnippetIds.length && (
                <div className="w-full up-bg-blue text-white">
                    <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
                        <button className="up-button text small light mr-2" onClick={() => setSelectedSnippetIds([])}><FiX/></button>
                        <button className="flex items-center" onClick={() => setSelectedSnippetsOpen(!selectedSnippetsOpen)}>
                            <p className="mr-2">{selectedSnippetIds.length} snippet{selectedSnippetIds.length > 1 ? "s" : ""} selected</p>
                            {selectedSnippetsOpen ? (
                                <FiChevronUp/>
                            ) : (
                                <FiChevronDown/>
                            )}
                        </button>
                        <div className="hidden sm:block ml-auto">
                            <Link href={`/post/new?projectId=${projectId}&back=/projects/${projectId}&snippets=${encodeURIComponent(JSON.stringify(selectedSnippetIds))}`}>
                                <a className="up-button text small">
                                    <div className="flex items-center h-full">
                                        <FiEdit/>
                                        <span className="ml-4">New post from selected</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4">
                        <Accordion openState={selectedSnippetsOpen} setOpenState={setSelectedSnippetsOpen}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                                {selectedSnippets && selectedSnippets.snippets && selectedSnippets.snippets.map(snippet => (
                                    <SnippetItemCard
                                        snippet={snippet}
                                        setTagsQuery={setTagsQuery}
                                        iteration={iteration}
                                        setIteration={setIteration}
                                        statsIter={statsIter}
                                        setStatsIter={setStatsIter}
                                        availableTags={availableTags}
                                        addNewTags={addNewTags}
                                        selectedSnippetIds={selectedSnippetIds}
                                        setSelectedSnippetIds={setSelectedSnippetIds}
                                        showFullDate={true}
                                    />
                                ))}
                            </div>
                        </Accordion>
                    </div>
                    <div className="max-w-7xl h-12 mx-auto px-4 flex items-center sm:hidden">
                        <Link href={`/post/new?projectId=${projectId}&back=/projects/${projectId}&snippets=${encodeURIComponent(JSON.stringify(selectedSnippetIds))}`}>
                            <a className="up-button text small ml-auto">
                                <div className="flex items-center h-full">
                                    <FiEdit/>
                                    <span className="ml-4">New post from selected</span>
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
            )}
            <div className={"w-full up-bg-gray-50 border-b up-border-gray-200 " + (selectedSnippetIds.length ? "pt-2" : "")}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="lg:flex items-center">
                        <div className="hidden lg:flex items-center order-2 ml-auto">
                            <TagControl large={false}/>
                            <SearchControl/>
                        </div>
                        <div className="flex items-center h-12">
                            <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "home" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("home")}>
                                All
                            </button>
                            <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "snippets" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("snippets")}>
                                Snippets ({numSnippets})
                            </button>
                            <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "posts" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("posts")}>
                                Posts ({numPosts})
                            </button>
                            <button className={`h-12 px-6 text-sm up-gray-400 relative ${tab === "stats" ? "bg-white font-bold up-gray-700 rounded-t-md border up-border-gray-200 border-b-0" : ""}`} style={{top: 1}} onClick={() => setTab("stats")}>
                                Stats ({percentLinked}%)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {tab === "stats" ? (
                    <ProjectStats projectId={projectId} statsIter={statsIter}/>
                ) : (
                    <>
                        {(snippetSearchQuery || (tagsQuery && !!tagsQuery.length)) && (
                            <UpBanner className="my-4">
                                <div className="flex items-center w-full">
                                    <p>Showing matches {snippetSearchQuery && `for "${snippetSearchQuery}" `}{tagsQuery && !!tagsQuery.length && "tagged "}{tagsQuery.map(tag => "#" + tag + " ")}</p>
                                    <button className="ml-auto up-button text small" onClick={() => {
                                        setSnippetSearchQuery("");
                                        setTagsQuery([]);
                                    }}>Clear</button>
                                </div>
                            </UpBanner>
                        )}
                        <div className="lg:hidden my-4">
                            <SearchControl/>
                            <TagControl large={true}/>
                        </div>
                        {displayReady ? displayItems.length > 0 ? (
                            <>
                                <div className="flex items-center my-4">
                                    <button
                                        className={"ml-auto up-button text small " + (!listView ? "selected" : "")}
                                        onClick={() => setListView(false)}
                                        // disabled={!listView}
                                    >
                                        <HiViewGrid/>
                                    </button>
                                    <button
                                        className={"ml-2 up-button text small " + (listView ? "selected" : "")}
                                        onClick={() => setListView(true)}
                                        // disabled={listView}
                                    >
                                        <HiViewList/>
                                    </button>
                                </div>
                                <div className={listView ? "-mt-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-12"}>
                                    {displayItems.map((item, i, a) => (
                                        <>
                                            {(i === 0 || format(new Date(item.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                                <p className="up-ui-title mt-12 pb-4 md:col-span-2 lg:col-span-3">{format(new Date(item.createdAt), "EEEE, MMMM d")}</p>
                                            )}
                                            {listView ? (item.type ? (
                                                    <SnippetItem
                                                        snippet={item}
                                                        iteration={iteration}
                                                        setIteration={setIteration}
                                                        availableTags={availableTags}
                                                        addNewTags={addNewTags}
                                                        setTagsQuery={setTagsQuery}
                                                        selectedSnippetIds={selectedSnippetIds}
                                                        setSelectedSnippetIds={setSelectedSnippetIds}
                                                        setStatsIter={setStatsIter}
                                                        statsIter={statsIter}
                                                    />
                                                ) : (
                                                    <PublicPostItem post={item}/>
                                                )
                                            ) : (item.type ? (
                                                    <SnippetItemCard
                                                        snippet={item}
                                                        setTagsQuery={setTagsQuery}
                                                        iteration={iteration}
                                                        setIteration={setIteration}
                                                        statsIter={statsIter}
                                                        setStatsIter={setStatsIter}
                                                        availableTags={availableTags}
                                                        addNewTags={addNewTags}
                                                        selectedSnippetIds={selectedSnippetIds}
                                                        setSelectedSnippetIds={setSelectedSnippetIds}
                                                    />
                                                ) : (
                                                    <PostItemCard post={item}/>
                                                )
                                            )}
                                        </>
                                    ))}
                                </div>
                                <p className="opacity-25 mt-16">
                                    Showing {displayLabel} {(displayPage - 1) * 10 + 1}
                                    -{(displayPage < Math.floor(displayCount / 10)) ? displayPage * 10 : displayCount} of {displayCount}
                                </p>
                                {displayCount > 10 && (
                                    <div className="mt-4">
                                        {Array.from({length: Math.ceil(displayCount / 10)}, (x, i) => i + 1).map(d => (
                                            <button
                                                className={"py-2 px-4 rounded-md mr-2 " + (d === displayPage ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                                                onClick={() => {
                                                    const setFunction = {
                                                        home: setItemPage,
                                                        posts: setPostPage,
                                                        snippets: setSnippetPage,
                                                    }[tab];
                                                    setFunction(d);
                                                }}
                                                disabled={+d === +displayPage}
                                            >{d}</button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="up-gray-400 my-8">{snippetSearchQuery ? "No snippets matching search query" : "No snippets or posts in this project yet. Press New Snippet or New Post to add some."}</p>
                        ) : (
                            <div className="mt-4">
                                <Skeleton count={10}/>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (Array.isArray(context.params.projectId)) return {notFound: true};

    // check auth
    const session = await getSession(context);

    if (!session || !session.userId) {
        context.res.setHeader("location", session ? "/auth/newaccount" : "/auth/signin");
        context.res.statusCode = 302;
        context.res.end();
        return {props: {}};
    }

    // fetch project info from MongoDB
    try {
        await dbConnect();

        // any typing to avoid ts error
        const projectId: any = context.params.projectId;

        const thisProject = await ProjectModel.findById(projectId);

        // check auth
        if (!thisProject || ![thisProject.userId.toString(), ...(thisProject.collaborators.map(d => d.toString()))].includes(session.userId)) {
            return {notFound: true};
        }

        const thisUser = await UserModel.findOne({ _id: thisProject.userId });

        return { props: { projectData: cleanForJSON(thisProject), thisUser: cleanForJSON(thisUser), key: context.params.projectId }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};