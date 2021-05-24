import React, {useState} from 'react';
import useSWR, {responseInterface} from "swr";
import {
    DatedObj,
    EmailObj,
    PostObj, privacyTypes,
    ProjectObj,
    SnippetObjGraph,
    SubscriptionObjGraph,
    UserObj
} from "../../utils/types";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {useRouter} from "next/router";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SnippetItemReduced from "../../components/snippet-item-reduced";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import {GetServerSideProps} from "next";
import {PostModel} from "../../models/post";
import UpSEO from "../../components/up-seo";
import {getSession} from "next-auth/client";
import UpBackLink from "../../components/up-back-link";
import short from "short-uuid";
import NewPostEditor from "../../components/new-post-editor";
import UpModal from "../../components/up-modal";
import SnippetBrowser from "../../components/snippet-browser";
import {SnippetModel} from "../../models/snippet";
import dbConnect from "../../utils/dbConnect";
import EasyMDE from "easymde";
import {FiChevronLeft, FiX} from "react-icons/fi";
import {Node} from "slate";

export default function NewPost(props: {post: DatedObj<PostObj>, projectId: string, urlName: string, selectedSnippetIds: string[]}) {
    const router = useRouter();
    const startProjectId = props.projectId || ((Array.isArray(router.query.projectId) || !router.query.projectId) ? "" : router.query.projectId);

    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [tempId, setTempId] = useState<string>(props.urlName || short.generate());
    const [selectedSnippetIds, setSelectedSnippetIds] = useState<string[]>(props.selectedSnippetIds || ((router.query.snippets && !Array.isArray(router.query.snippets)) ? JSON.parse(router.query.snippets) : []));
    const [isBrowseOpen, setIsBrowseOpen] = useState<boolean>(false);
    const [instance, setInstance] = useState<EasyMDE>(null);
    const [isSnippetsOpen, setIsSnippetsOpen] = useState<boolean>(false);

    const {data: selectedSnippets, error: selectedSnippetsError}: responseInterface<{snippets: DatedObj<SnippetObjGraph>[], count: number }, any> = useSWR(`/api/snippet?ids=${encodeURIComponent(JSON.stringify(selectedSnippetIds))}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const {data: sharedProjects, error: sharedProjectsError}: responseInterface<{projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] }, any> = useSWR("/api/project?shared=true", fetcher);

    function getProjectLabel(projectId: string): string {
        if (!(projects && sharedProjects && (projects.projects.length + sharedProjects.projects.length > 0))) return "";
        const thisProject: DatedObj<ProjectObj> = [...projects.projects, ...sharedProjects.projects].find(d => d._id === projectId);
        let label = thisProject.name;
        if (sharedProjects.projects.map(d => d._id).includes(projectId)) label += ` (owned by ${sharedProjects.owners.find(d => d._id === thisProject.userId).name})`;
        return label;
    }

    function onSaveEdit(projectId: string, title: string, body: string | Node[], privacy: privacyTypes, tags: string[], isSlate?: boolean, sendEmail?: boolean) {
        setIsEditLoading(true);

        axios.post("/api/post", {
            projectId: projectId || "",
            postId: props.post ? props.post._id : "",
            title: title,
            body: body,
            privacy: privacy,
            tags: tags,
            tempId: tempId,
            selectedSnippetIds: selectedSnippetIds,
            isSlate: !!isSlate,
            sendEmail: !!sendEmail,
        }).then(res => {
            // @ts-ignore
            window.analytics.track("Item created", {
                type: "post",
                projectId: projectId,
            });
            router.push(privacy === "draft" ? `/projects/${projectId}` : res.data.url);
        }).catch(e => {
            console.log(e);
            setIsEditLoading(false);
        });
    }

    async function onCancelEdit() {
        await axios.post("/api/cancel-delete-images", props.post ? {id: props.post._id, type: "post"} : {urlName: tempId});
        router.push((Array.isArray(router.query.back) || !router.query.back) ? "/projects" : router.query.back);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-16">
            <UpSEO title={(props.post ? "Edit post" : "New post")}/>
            <UpBackLink link={!router.query.back || (Array.isArray(router.query.back)) ? "/projects" : router.query.back} text="project" className="mb-8 pt-12 lg:pt-0"/>
            <div className="lg:flex">
                <div className="lg:w-2/3 lg:pr-4 lg:border-r">
                    <h1 className="up-ui-title mb-8">{props.post ? "Edit" : "New"} post</h1>
                    <NewPostEditor
                        tempId={tempId}
                        startProjectId={startProjectId}
                        projects={projects}
                        sharedProjects={sharedProjects}
                        onSaveEdit={onSaveEdit}
                        onCancelEdit={onCancelEdit}
                        getProjectLabel={getProjectLabel}
                        isEditLoading={isEditLoading}
                        postId={props.post ? props.post._id : null}
                        title={props.post ? props.post.title : null}
                        body={props.post ? props.post.body : null}
                        slateBody={props.post ? props.post.slateBody : null}
                        privacy={props.post ? props.post.privacy : null}
                        tags={props.post ? props.post.tags : null}
                        setInstance={setInstance}
                    />
                </div>
                <button
                    className="w-full h-12 lg:hidden bg-white flex items-center fixed top-16 left-0 px-4 justify-end border-t border-b z-10"
                    onClick={() => setIsSnippetsOpen(true)}
                >
                            <span className="inline-block mr-2 font-bold">
                                Linked snippets ({selectedSnippetIds.length})
                            </span>
                    <FiChevronLeft/>
                </button>
                <div
                    className="w-96 max-w-full lg:w-1/3 border-l lg:border-none pl-4 lg:opacity-25 lg:hover:opacity-100 transition fixed lg:sticky bg-white z-40 top-0 lg:top-24 pt-8 right-0 h-full"
                    style={{marginRight: isSnippetsOpen ? "0" : "-100%", transition: "all 0.2s ease"}}
                >
                    <div className="flex items-center pb-4 pr-4">
                        <h3 className="up-ui-title">Linked snippets ({selectedSnippetIds.length})</h3>
                        <button className="ml-auto lg:hidden p-2" onClick={() => setIsSnippetsOpen(false)}><FiX/></button>
                    </div>
                    <div className="overflow-y-auto overflow-x-hidden px-4 -ml-4" style={{maxHeight: "calc(100vh - 320px)"}}>
                        {selectedSnippets ? selectedSnippets.snippets.length ? (
                            <>
                                {selectedSnippets.snippets.map((snippet, i, a) => (
                                    <div key={snippet._id}>
                                        {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                            <p className="opacity-50 mt-8 pb-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                                        )}
                                        <SnippetItemReduced snippet={snippet} selectedSnippetIds={selectedSnippetIds} setSelectedSnippetIds={setSelectedSnippetIds}/>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="opacity-50 my-4">No linked snippets. Click "Browse snippets" to select some</p>
                        ) : (
                            <Skeleton count={4}/>
                        )}
                    </div>
                    <button onClick={() => setIsBrowseOpen(true)} className="up-button small mt-4">Browse snippets</button>
                    <UpModal isOpen={isBrowseOpen} setIsOpen={setIsBrowseOpen} wide={true}>
                        <SnippetBrowser
                            startProjectId={startProjectId}
                            selectedSnippetIds={selectedSnippetIds}
                            setSelectedSnippetIds={setSelectedSnippetIds}
                            onClose={() => setIsBrowseOpen(false)}
                            className="relative"
                            style={{
                                left: "-1rem",
                                width: "calc(100% + 2rem)"
                            }}
                        />
                    </UpModal>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        context.res.setHeader("location", session ? "/projects" : "/auth/signin");
        context.res.statusCode = 302;
        context.res.end();

        return {props: {}};
    }

    if (Array.isArray(context.params.postId)) return {notFound: true};

    const postId: any = context.params.postId;

    if (postId === "new") return {props: {post: null, projectId: null, urlName: null, linkedPosts: null}};

    try {
        await dbConnect();

        const thisPost = await PostModel.findOne({ _id: postId });

        if (!thisPost) return {notFound: true};

        const selectedSnippets = await SnippetModel.find({ linkedPosts: postId });

        return {props: {post: cleanForJSON(thisPost), projectId: thisPost.projectId.toString(), urlName: thisPost.urlName, selectedSnippetIds: selectedSnippets.map(d => d._id.toString())}};
    } catch (e) {
        return {notFound: true};
    }
}