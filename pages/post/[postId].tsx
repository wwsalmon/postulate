import React, {useState} from 'react';
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObj, SnippetObj} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import {useRouter} from "next/router";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SnippetItemReduced from "../../components/snippet-item-reduced";
import SimpleMDEEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import SpinnerButton from "../../components/spinner-button";
import axios from "axios";
import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {PostModel} from "../../models/post";
import Select from "react-select";

export default function NewPost(props: {title: string, body: string, postId: string, projectId: string}) {
    const router = useRouter();
    const startProjectId = props.projectId || ((Array.isArray(router.query.projectId) || !router.query.projectId) ? "" : router.query.projectId);

    const [iteration, setIteration] = useState<number>(null);
    const [body, setBody] = useState<string>(props.body);
    const [title, setTitle] = useState<string>(props.title);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [snippetProjectId, setSnippetProjectId] = useState<string>(startProjectId);
    const [projectId, setProjectId] = useState<string>(startProjectId);
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[] }, any> = useSWR(`/api/project/snippet/list?projectId=${snippetProjectId}&iteration=${iteration}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);

    function onSaveEdit() {
        setIsEditLoading(true);

        axios.post("/api/post", {
            projectId: projectId || "",
            postId: props.postId || "",
            title: title,
            body: body,
        }).then(res => {
            router.push(res.data.url);
        }).catch(e => {
            console.log(e);
            setIsEditLoading(false);
        })
    }

    function onCancelEdit() {
        router.push((Array.isArray(router.query.back) || !router.query.back) ? "/projects" : router.query.back);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex">
                <div className="w-2/3 pr-4 border-r">
                    <h1 className="up-h1 mb-8">{props.postId ? "Edit" : "New"} post</h1>
                    <hr className="my-8"/>
                    <h3 className="up-ui-title mb-4">Title</h3>
                    <input
                        type="text"
                        className="w-full text-xl h-12"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Add a title"
                    />
                    <hr className="my-8"/>
                    <h3 className="up-ui-title mb-4">Project</h3>
                    <Select
                        options={(projects && projects.projects.length > 0) ? projects.projects.map(project => ({
                            value: project._id,
                            label: project.name,
                        })) : []}
                        value={{
                            value: projectId,
                            label: (projects && projects.projects.length > 0) ? projects.projects.find(d => d._id === projectId).name : ""}}
                        onChange={option => setProjectId(option.value)}
                        className="mt-4"
                    />
                    <hr className="my-8"/>
                    <h3 className="up-ui-title mb-4">Body</h3>
                    <div className="content prose w-full">
                        <SimpleMDEEditor
                            value={body}
                            onChange={setBody}
                            options={{
                                spellChecker: false,
                                placeholder: "Turn your snippets into a shareable post!",
                                toolbar: ["bold", "italic", "strikethrough", "|", "heading-1", "heading-2", "heading-3", "|", "link", "quote", "unordered-list", "ordered-list", "|", "guide"],
                            }}
                        />
                    </div>
                    <div className="flex mt-4">
                        <SpinnerButton isLoading={isEditLoading} onClick={onSaveEdit} isDisabled={!body || !title}>
                            Save
                        </SpinnerButton>
                        <button className="up-button text" onClick={onCancelEdit} disabled={isEditLoading}>Cancel</button>
                    </div>
                </div>
                <div className="w-1/3 pl-4">
                    <h3 className="up-ui-title">View snippets from</h3>
                    <Select
                        options={(projects && projects.projects.length > 0) ? projects.projects.map(project => ({
                            value: project._id,
                            label: project.name,
                        })) : []}
                        value={{
                            value: snippetProjectId,
                            label: (projects && projects.projects.length > 0) ? projects.projects.find(d => d._id === snippetProjectId).name : ""}}
                        onChange={option => setSnippetProjectId(option.value)}
                        className="mt-4"
                    />
                    <hr className="mt-8 -ml-4"/>
                    <div className="overflow-y-auto overflow-x-hidden pl-4 -ml-4" style={{maxHeight: "calc(100vh - 360px)"}}>
                        {(snippets && snippets.snippets) ? snippets.snippets.length > 0 ? snippets.snippets.map((snippet, i, a) => (
                            <>
                                {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                    <p className="up-ui-title mt-6 pb-4 border-b opacity-50 pl-4 -mx-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                                )}
                                <SnippetItemReduced snippet={snippet}/>
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
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (Array.isArray(context.params.postId)) return {notFound: true};

    const postId = context.params.postId;

    if (postId === "new") return {props: {title: "", body: "", postId: null, projectId: null}};

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const thisPost = await PostModel.findOne({ _id: postId });

        if (!thisPost) return {notFound: true};

        return {props: {title: thisPost.title, body: thisPost.body, postId: postId, projectId: thisPost.projectId.toString()}};
    } catch (e) {
        return {notFound: true};
    }
}