import {GetServerSideProps} from "next";
import mongoose from "mongoose";
import {ProjectModel} from "../../../models/project";
import {UserModel} from "../../../models/user";
import {cleanForJSON, fetcher} from "../../../utils/utils";
import {DatedObj, ProjectObj, SnippetObj} from "../../../utils/types";
import BackToProjects from "../../../components/back-to-projects";
import React, {useState} from "react";
import {useSession} from "next-auth/client";
import {FiEdit, FiEdit2, FiLink, FiTrash} from "react-icons/fi";
import Link from "next/link";
import SimpleMDEEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import SpinnerButton from "../../../components/spinner-button";
import axios from "axios";
import useSWR, {responseInterface} from "swr";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import MoreMenu from "../../../components/more-menu";
import MoreMenuItem from "../../../components/more-menu-item";
import SnippetItem from "../../../components/snippet-item";
import {useRouter} from "next/router";
import Modal from "react-modal";
import UpModal from "../../../components/up-modal";

export default function Project(props: {projectData: DatedObj<ProjectObj>}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [isSnippet, setIsSnippet] = useState<boolean>(false);
    const [isResource, setIsResource] = useState<boolean>(false);
    const [body, setBody] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iteration, setIteration] = useState<number>(0);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const {_id: projectId, userId, name, description, createdAt, stars} = props.projectData;
    const isOwner = session && session.userId === userId;
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[] }, any> = useSWR(`/api/project/snippet/list?projectId=${projectId}&?iter=${iteration}`, fetcher);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/project/snippet/new", {
            projectId: projectId,
            type: isSnippet ? "snippet" : "resource",
            body: body || "",
            url: url || "",
        }).then(res => {
            setIsLoading(false);
            console.log(res);
            isSnippet ? onCancelSnippet() : onCancelResource();
            setIteration(iteration + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelSnippet() {
        setIsSnippet(false);
        setBody("");
    }

    function onCancelResource() {
        setIsResource(false);
        setBody("");
        setUrl("");
    }

    function onDelete() {
        setIsDeleteLoading(true);

        axios.post("/api/project/delete", {
            id: projectId,
        }).then(() => {
            router.push("/projects");
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <BackToProjects/>
            <div className="flex items-center">
                <div>
                    <h1 className="up-h1 mt-8 mb-2">{name}</h1>
                    <p className="content">{description}</p>
                </div>
                {isOwner && (
                    <div className="ml-auto">
                        <MoreMenu>
                            <MoreMenuItem text="Edit" icon={<FiEdit2/>}/>
                            <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
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
                    </div>
                )}
            </div>
            <hr className="my-8"/>
            {isOwner && (!(isSnippet || isResource) ? (
                <div className="flex items-center">
                    <button className="up-button primary mr-4" onClick={() => setIsSnippet(true)}>
                        New snippet
                    </button>
                    <button className="up-button text" onClick={() => setIsResource(true)}>
                        <div className="flex items-center">
                            <FiLink/>
                            <span className="ml-4">Add resource</span>
                        </div>
                    </button>
                    <Link href="/newpost">
                        <a className="up-button ml-auto">
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
                    {isResource && (
                        <input
                            type="text"
                            className="content px-4 py-2 border rounded-md w-full mb-8"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="Resource URL"
                        />
                    )}
                    <div className="prose content snippet-editor">
                        <SimpleMDEEditor
                            value={body}
                            onChange={setBody}
                            options={{
                                spellChecker: false,
                                placeholder: isSnippet ? "Write down an interesting thought or development" : "Jot down some notes about this resource",
                                toolbar: ["bold", "italic", "strikethrough", "|", "heading-1", "heading-2", "heading-3", "|", "link", "quote", "unordered-list", "ordered-list", "|", "guide"],
                            }}
                        />
                    </div>
                    <SpinnerButton
                        onClick={onSubmit}
                        isLoading={isLoading}
                        isDisabled={(isSnippet && body.length === 0) || (isResource && url.length === 0)}
                        className="mr-2"
                    >
                        Save
                    </SpinnerButton>
                    <button className="up-button text" onClick={isSnippet ? onCancelSnippet : onCancelResource}>Cancel</button>
                </div>
            ))}
            <hr className="my-4 invisible"/>
            {snippets ? snippets.snippets.map((snippet, i, a) => (
                <>
                    {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                        <p className="up-ui-item-title mt-12 pb-8 border-b">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                    )}
                    <SnippetItem snippet={snippet} iteration={iteration} setIteration={setIteration}/>
                </>
            )) : (
                <Skeleton count={10}/>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    // fetch project info from MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const thisUser = await UserModel.findOne({ username: username });

        if (!thisUser) return { notFound: true };

        const thisProject = await ProjectModel.findOne({ userId: thisUser._id, urlName: projectUrlName });

        return { props: { projectData: cleanForJSON(thisProject), key: projectUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};