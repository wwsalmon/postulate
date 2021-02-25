import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {getSession, useSession} from "next-auth/client";
import {DatedObj, PostObj, ProjectObj, SnippetObj, UserObj} from "../../utils/types";
import React, {useState} from "react";
import {useRouter} from "next/router";
import useSWR, {responseInterface} from "swr";
import axios from "axios";
import UpSEO from "../../components/up-seo";
import BackToProjects from "../../components/back-to-projects";
import MoreMenu from "../../components/more-menu";
import MoreMenuItem from "../../components/more-menu-item";
import {FiEdit, FiEdit2, FiEye, FiLink, FiTrash, FiUserPlus, FiX} from "react-icons/fi";
import UpModal from "../../components/up-modal";
import SpinnerButton from "../../components/spinner-button";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Link from "next/link";
import SnippetEditor from "../../components/snippet-editor";
import {format} from "date-fns";
import SnippetItem from "../../components/snippet-item";

export default function ProjectWorkspace(props: {projectData: DatedObj<ProjectObj>}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [isSnippet, setIsSnippet] = useState<boolean>(false);
    const [isResource, setIsResource] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    const [{_id: projectId, userId, name, description, urlName, createdAt, stars, collaborators, availableTags }, setProjectData] = useState<DatedObj<ProjectObj>>(props.projectData);

    const isCollaborator = session && props.projectData.collaborators.includes(session.userId);
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[], authors: DatedObj<UserObj>[] }, any> = useSWR(`/api/snippet?projectId=${projectId}&iter=${iteration}&search=${snippetSearchQuery}&tags=${encodeURIComponent(JSON.stringify(tagsQuery))}&userIds=${encodeURIComponent(JSON.stringify(authorsQuery))}`, fetcher);
    const {data: posts, error: postsError}: responseInterface<{posts: DatedObj<PostObj>[], authors: DatedObj<UserObj>[] }, any> = useSWR(`/api/post?projectId=${projectId}`, fetcher);
    const {data: collaboratorObjs, error: collaboratorObjsError}: responseInterface<{collaborators: DatedObj<UserObj>[] }, any> = useSWR(`/api/project/collaborator?projectId=${projectId}&iter=${collaboratorIteration}`, fetcher);

    function onSubmit(urlName: string, isSnippet: boolean, body: string, url: string, tags: string[]) {
        setIsLoading(true);

        axios.post("/api/snippet", {
            projectId: projectId,
            urlName: urlName,
            type: isSnippet ? "snippet" : "resource",
            body: body || "",
            url: url || "",
            tags: tags || [],
        }).then(res => {
            if (res.data.newTags.length) addNewTags(res.data.newTags);
            setIsLoading(false);
            setIteration(iteration + 1);
            setIsSnippet(false);
            setIsResource(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelSnippetOrResource(urlName: string) {
        setIsSnippet(false);
        setIsResource(false);
        axios.post("/api/cancel-delete-images", {urlName: urlName}).catch(e => console.log(e));
    }

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

    return (
        <div className="max-w-7xl mx-auto px-4 pb-16">
            <UpSEO title={props.projectData.name} description={props.projectData.description}/>
            <div className="md:flex">
                <div className="md:w-2/3 md:pr-8 md:border-r">
                    <BackToProjects/>
                    <div className="flex items-center">
                        <div>
                            <h1 className="up-h1 mt-8 mb-2">{name}</h1>
                            <p className="up-h2">{description}</p>
                        </div>
                        <div className="ml-auto">
                            <MoreMenu>
                                <MoreMenuItem text="Edit" icon={<FiEdit2/>} href={`/@${session ? session.username : ""}/${urlName}/edit`}/>
                                <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
                                <MoreMenuItem text="Add collaborators" icon={<FiUserPlus/>} onClick={() => setAddCollaboratorOpen(true)}/>
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
                                                console.log(filteredResults);
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
                                    <Skeleton count={2}/>
                                )}
                            </UpModal>
                        </div>
                    </div>
                    <hr className="my-8"/>
                    {!(isSnippet || isResource) ? (
                        <div className="md:flex items-center">
                            <button className="up-button primary mr-4 mb-4 md:mb-0" onClick={() => setIsSnippet(true)}>
                                New snippet
                            </button>
                            <button className="up-button text mb-4 md:mb-0" onClick={() => setIsResource(true)}>
                                <div className="flex items-center">
                                    <FiLink/>
                                    <span className="ml-4">Add resource</span>
                                </div>
                            </button>
                            <Link href={`/post/new?projectId=${projectId}&back=/@${session ? session.username : ""}/${urlName}`}>
                                <a className="up-button ml-auto mb-4 md:mb-0">
                                    <div className="flex items-center">
                                        <FiEdit/>
                                        <span className="ml-4">New post</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    ) : (
                        <div className="p-4 shadow-md rounded-md">
                            <h3 className="up-ui-item-title mb-4">{isSnippet ? "New snippet" : "Add resource"}</h3>
                            <SnippetEditor
                                isSnippet={isSnippet}
                                projectId={projectId}
                                availableTags={availableTags}
                                isLoading={isLoading}
                                onSaveEdit={onSubmit}
                                onCancelEdit={onCancelSnippetOrResource}
                            />
                        </div>
                    )}
                    <hr className="my-8"/>
                    <div className="md:flex items-center">
                        <input
                            type="text"
                            className="border-b my-2 py-2 mr-4 flex-grow"
                            placeholder="Search"
                            value={snippetSearchQuery}
                            onChange={e => setSnippetSearchQuery(e.target.value)}
                        />
                        <Select
                            className="flex-grow mr-4"
                            options={availableTags.map(d => ({label: d, value: d}))}
                            value={tagsQuery.map(d => ({label: d, value: d}))}
                            onChange={(newValue) => setTagsQuery(newValue.map(d => d.value))}
                            placeholder="Filter by tag"
                            isMulti
                        />
                        <button
                            className="underline opacity-50 hover:opacity-100 transition ml-auto flex-shrink-0"
                            onClick={() => setOrderNew(!orderNew)}
                        >{orderNew ? "View oldest first" : "View newest first"}</button>
                    </div>
                    {snippets ? snippets.snippets.length > 0 ? (orderNew ? snippets.snippets.slice(0).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) : snippets.snippets).map((snippet, i, a) => (
                        <div key={snippet._id}>
                            {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                <p className="up-ui-title mt-12 pb-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                            )}
                            <SnippetItem
                                snippet={snippet}
                                authors={snippets.authors}
                                iteration={iteration}
                                setIteration={setIteration}
                                availableTags={availableTags}
                                addNewTags={addNewTags}
                                setTagsQuery={setTagsQuery}
                            />
                        </div>
                    )) : (
                        <p className="mt-8">{snippetSearchQuery ? "No snippets matching search query" : "No snippets in this project"}</p>
                    ) : (
                        <Skeleton count={10}/>
                    )}
                </div>
                <div className="md:w-1/3 md:pl-8">
                    <p>Posts</p>
                </div>
            </div>

        </div>
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
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
        }

        // any typing to avoid ts error
        const projectId: any = context.params.projectId;

        console.log(projectId);

        const thisProject = await ProjectModel.findOne({ _id: projectId });

        // check auth
        if (!thisProject || ![thisProject.userId.toString(), ...(thisProject.collaborators.map(d => d.toString()))].includes(session.userId)) {
            return {notFound: true};
        }

        return { props: { projectData: cleanForJSON(thisProject), key: context.params.projectId }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};