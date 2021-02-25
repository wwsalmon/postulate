import React, {useState} from 'react';
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObj, SnippetObj, UserObj} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import {useRouter} from "next/router";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SnippetItemReduced from "../../components/snippet-item-reduced";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {PostModel} from "../../models/post";
import Select from "react-select";
import UpSEO from "../../components/up-seo";
import {getSession} from "next-auth/client";
import UpBackLink from "../../components/up-back-link";
import short from "short-uuid";
import NewPostEditor from "../../components/new-post-editor";

export default function NewPost(props: {title: string, body: string, postId: string, projectId: string, urlName: string}) {
    const router = useRouter();
    const startProjectId = props.projectId || ((Array.isArray(router.query.projectId) || !router.query.projectId) ? "" : router.query.projectId);

    const [iteration, setIteration] = useState<number>(null);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [snippetProjectId, setSnippetProjectId] = useState<string>(startProjectId);
    const [tempId, setTempId] = useState<string>(props.urlName || short.generate());
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[], authors: DatedObj<UserObj>[] }, any> = useSWR(`/api/snippet?projectId=${snippetProjectId}&iteration=${iteration}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const {data: sharedProjects, error: sharedProjectsError}: responseInterface<{projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] }, any> = useSWR("/api/project?shared=true", fetcher);

    function getProjectLabel(projectId: string): string {
        if (!(projects && sharedProjects)) return "";
        const thisProject: DatedObj<ProjectObj> = [...projects.projects, ...sharedProjects.projects].find(d => d._id === projectId);
        let label = thisProject.name;
        if (sharedProjects.projects.map(d => d._id).includes(projectId)) label += ` (owned by ${sharedProjects.owners.find(d => d._id === thisProject.userId).name})`;
        return label;
    }

    function onSaveEdit(projectId: string, title: string, body: string) {
        setIsEditLoading(true);

        axios.post("/api/post", {
            projectId: projectId || "",
            postId: props.postId || "",
            title: title,
            body: body,
            tempId: tempId,
        }).then(res => {
            router.push(res.data.url);
        }).catch(e => {
            console.log(e);
            setIsEditLoading(false);
        })
    }

    async function onCancelEdit() {
        await axios.post("/api/cancel-delete-images", props.postId ? {id: props.postId, type: "post"} : {urlName: tempId});
        router.push((Array.isArray(router.query.back) || !router.query.back) ? "/projects" : router.query.back);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-16">
            <UpSEO title={(props.postId ? "Edit post" : "New post")}/>
            <UpBackLink link={Array.isArray(router.query.back) ? "/projects" : router.query.back} text="project" className="mb-8"/>
            <div className="flex">
                <div className="w-2/3 pr-4 border-r">
                    <h1 className="up-h1 mb-8">{props.postId ? "Edit" : "New"} post</h1>
                    <hr className="my-8"/>
                    <NewPostEditor
                        tempId={tempId}
                        startProjectId={startProjectId}
                        projects={projects}
                        sharedProjects={sharedProjects}
                        onSaveEdit={onSaveEdit}
                        onCancelEdit={onCancelEdit}
                        getProjectLabel={getProjectLabel}
                        isEditLoading={isEditLoading}
                        title={props.title}
                        body={props.body}
                    />
                </div>
                <div className="w-1/3 pl-4 opacity-25 hover:opacity-100 transition">
                    <div className="sticky" style={{top: 100}}>
                        <h3 className="up-ui-title">View snippets from</h3>
                        <Select
                            options={(projects && sharedProjects) ? [...projects.projects, ...sharedProjects.projects].map(project => ({
                                value: project._id,
                                label: getProjectLabel(project._id),
                            })) : []}
                            value={{
                                value: snippetProjectId,
                                label: getProjectLabel(snippetProjectId)
                            }}
                            onChange={option => setSnippetProjectId(option.value)}
                            className="mt-4"
                        />
                        <hr className="mt-8 -ml-4"/>
                        <div className="overflow-y-auto overflow-x-hidden pl-4 -ml-4" style={{maxHeight: "calc(100vh - 320px)"}}>
                            {(snippets && snippets.snippets) ? snippets.snippets.length > 0 ? snippets.snippets.map((snippet, i, a) => (
                                <>
                                    {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                        <p className="up-ui-title mt-6 pb-4 border-b opacity-50 pl-4 -mx-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                                    )}
                                    <SnippetItemReduced snippet={snippet} authors={snippets.authors}/>
                                </>
                            )) : (
                                <p>No snippets in this project</p>
                            ) : (
                                <Skeleton count={10}/>
                            )}
                        </div>
                    </div>
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

    if (postId === "new") return {props: {title: "", body: "", postId: null, projectId: null, urlName: null}};

    try {
        if (!mongoose.connection) {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
        }

        const thisPost = await PostModel.findOne({ _id: postId });

        if (!thisPost) return {notFound: true};

        return {props: {title: thisPost.title, body: thisPost.body, postId: postId, projectId: thisPost.projectId.toString(), urlName: thisPost.urlName}};
    } catch (e) {
        return {notFound: true};
    }
}