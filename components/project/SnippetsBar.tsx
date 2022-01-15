import Button from "../headless/Button";
import React, {useEffect, useState} from "react";
import {DatedObj, ProjectObj, SnippetObj, UserObj} from "../../utils/types";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {Transition} from "@headlessui/react";
import useSWR from "swr";
import {fetcher, slateInitValue} from "../../utils/utils";
import TruncatedText from "../standard/TruncatedText";
import {format} from "date-fns";
import UiH3 from "../style/UiH3";
import SnippetCard from "./SnippetCard";
import UiButton from "../style/UiButton";
import axios from "axios";

export default function SnippetsBar({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    if (!isOwner) return (<></>);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(null);
    const [snippets, setSnippets] = useState<DatedObj<SnippetObj>[]>([]);
    const [newSnippetId, setNewSnippetId] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {data} = useSWR<{ snippets: DatedObj<SnippetObj>[] }>(`/api/snippet?projectId=${pageProject._id}&iter=${iter}`, fetcher);

    useEffect(() => {
        if (data && data.snippets) {
            setSnippets(data.snippets);
            setIsLoading(false);
        }
    }, [data]);

    function onNew() {
        setIsLoading(true);

        axios.post("/api/snippet", {projectId: pageProject._id, body: slateInitValue}).then(res => {
            setNewSnippetId(res.data.snippet._id);
            setPage(0);
            setIter(iter + 1);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    return (
        <>
            <div className="fixed w-full bg-white h-12 bottom-0 left-0 flex items-center">
                <Button
                    className="h-full ml-auto px-4 hover:bg-gray-100 transition"
                    flex={true}
                    onClick={() => setIsOpen(true)}
                >
                    <FiChevronLeft/>
                    <span className="ml-2">Show snippets</span>
                </Button>
            </div>
            <Transition
                show={isOpen}
                enter="transition-transform duration-200 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform duration-200 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
                className="fixed bg-white border-l border-gray-300 top-12 sm:top-16 right-0 flex flex-col h-full w-screen max-w-md pb-12 sm:pb-16"
            >
                <div className="px-4 sm:px-6 overflow-y-auto">
                    <UiH3>Snippets</UiH3>
                    <p className="text-gray-400">Fleeting notes that only you can see</p>
                    {snippets.map((snippet, i, a) => (
                        <>
                            {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i - 1].createdAt), "yyyy-MM-dd")) && (
                                <p className="mb-4 mt-12 text-sm text-gray-400 font-medium font-manrope">
                                    {format(
                                        new Date(snippet.createdAt),
                                        `EEEE, MMM d ${+new Date() - +new Date(snippet.createdAt) > 365 * 24 * 60 * 60 * 1000 ? "yyyy" : ""}`
                                    )}
                                </p>
                            )}
                            <SnippetCard
                                snippet={snippet}
                                iter={iter}
                                setIter={setIter}
                                key={snippet._id}
                                snippetId={newSnippetId}
                                setSnippetId={setNewSnippetId}
                            />
                        </>
                    ))}
                </div>
                <div
                    className="h-12 mt-auto flex-shrink-0 border-t border-gray-300 flex items-center"
                >
                    <Button
                        className="h-full hover:bg-gray-100 transition px-4 flex-grow"
                        onClick={() => setIsOpen(false)}
                        flex={true}
                    >
                        <FiChevronRight/>
                        <span className="ml-2">Hide snippets</span>
                    </Button>
                    <UiButton className="mx-4" isLoading={isLoading} onClick={onNew}>New</UiButton>
                </div>
            </Transition>
        </>
    );
}