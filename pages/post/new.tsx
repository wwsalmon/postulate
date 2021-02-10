import React, {useState} from 'react';
import useSWR, {responseInterface} from "swr";
import {DatedObj, SnippetObj} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import {useRouter} from "next/router";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SnippetItemReduced from "../../components/snippet-item-reduced";
import SimpleMDEEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import SpinnerButton from "../../components/spinner-button";
import axios from "axios";

export default function NewPost({}: {}) {
    const router = useRouter();
    const [iteration, setIteration] = useState<number>(null);
    const [body, setBody] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [projectId, setProjectId] = useState<string>((Array.isArray(router.query.projectId) || !router.query.projectId) ? "" : router.query.projectId);
    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[] }, any> = useSWR(`/api/project/snippet/list?projectId=${projectId}&iteration=${iteration}`, fetcher);

    function onSaveEdit() {
        setIsEditLoading(true);

        axios.post("/api/post", {
            projectId: projectId,
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
            <div className="flex -mx-4">
                <div className="w-3/4 mx-4">
                    <h1 className="up-h1 mb-8">New post</h1>
                    <hr className="my-8"/>
                    <h3 className="up-ui-title mb-4">Title</h3>
                    <input
                        type="text"
                        className="w-full text-xl h-12 mb-8"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Add a title"
                    />
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
                <div className="w-1/4 mx-4">
                    <h3 className="up-ui-title">Project</h3>
                    {snippets ? snippets.snippets.length > 0 ? snippets.snippets.map((snippet, i, a) => (
                        <>
                            {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                <p className="up-ui-title mt-12 pb-8 border-b">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
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
    );
}