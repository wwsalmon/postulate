import Button from "../headless/Button";
import React, {useState} from "react";
import {DatedObj, ProjectObj, SnippetObj, UserObj} from "../../utils/types";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {Transition} from "@headlessui/react";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import TruncatedText from "../standard/TruncatedText";
import {format} from "date-fns";
import UiH3 from "../style/UiH3";

export default function SnippetsBar({pageProject, pageUser, thisUser}: {pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>}) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    if (!isOwner) return (<></>);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {data} = useSWR<{snippets: DatedObj<SnippetObj>[]}>(`/api/snippet?projectId=${pageProject._id}`, fetcher);

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
                    {data && data.snippets.map((snippet, i, a) => (
                        <>
                            {(i === 0 || format(new Date(snippet.updatedAt), "yyyy-MM-dd") !== format(new Date(a[i-1].updatedAt), "yyyy-MM-dd")) && (
                                <p className="mb-4 mt-12 text-sm text-gray-400 font-medium font-manrope">
                                    {format(
                                        new Date(snippet.updatedAt),
                                        `EEEE, MMM d ${+new Date() - +new Date(snippet.updatedAt) > 365 * 24 * 60 * 60 * 1000 ? "yyyy" : ""}`
                                    )}
                                </p>
                            )}
                            <button key={snippet._id} className="p-4 border border-gray-300 rounded-md mb-4 text-left w-full block hover:bg-gray-50 transition">
                                <TruncatedText value={snippet.slateBody}/>
                            </button>
                        </>
                    ))}
                </div>
                <Button
                    className="h-12 mt-auto hover:bg-gray-100 transition px-4 flex-shrink-0 border-t border-gray-300"
                    onClick={() => setIsOpen(false)}
                    flex={true}
                >
                    <FiChevronRight/>
                    <span className="ml-2">Hide snippets</span>
                </Button>
            </Transition>
        </>
    );
}