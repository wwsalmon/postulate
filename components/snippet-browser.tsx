import React, {Dispatch, SetStateAction, useState} from "react";
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObj, SnippetObj, UserObj} from "../utils/types";
import {fetcher} from "../utils/utils";
import Select from "react-select";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SnippetItemReduced from "./snippet-item-reduced";
import {BiLink, BiUnlink} from "react-icons/bi";

export default function SnippetBrowser({startProjectId, selectedSnippetIds, setSelectedSnippetIds, onClose, className, style}: {
    startProjectId: string,
    selectedSnippetIds: string[],
    setSelectedSnippetIds: Dispatch<SetStateAction<string[]>>,
    onClose: () => void,
    className?: string,
    style?: React.CSSProperties,
}) {
    const [snippetProjectId, setSnippetProjectId] = useState<string>(startProjectId);
    const [orderNew, setOrderNew] = useState<boolean>(true);
    const [snippetSearchQuery, setSnippetSearchQuery] = useState<string>("");
    const [tagsQuery, setTagsQuery] = useState<string[]>([]);
    const [authorsQuery, setAuthorsQuery] = useState<string[]>([]);
    const [snippetPage, setSnippetPage] = useState<number>(1);
    const [linkedQuery, setLinkedQuery] = useState<"true"|"false"|"all">("all");

    const {data: snippets, error: snippetsError}: responseInterface<{snippets: DatedObj<SnippetObj>[], authors: DatedObj<UserObj>[], count: number }, any> = useSWR(`/api/snippet?projectId=${snippetProjectId}&search=${snippetSearchQuery}&tags=${encodeURIComponent(JSON.stringify(tagsQuery))}&userIds=${encodeURIComponent(JSON.stringify(authorsQuery))}&page=${snippetPage}&sort=${orderNew ? "-1" : "1"}&linked=${linkedQuery}`, fetcher);
    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const {data: sharedProjects, error: sharedProjectsError}: responseInterface<{projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] }, any> = useSWR("/api/project?shared=true", fetcher);

    function getProjectLabel(projectId: string): string {
        if (!(projects && sharedProjects)) return "";
        const thisProject: DatedObj<ProjectObj> = [...projects.projects, ...sharedProjects.projects].find(d => d._id === projectId);
        let label = thisProject.name;
        if (sharedProjects.projects.map(d => d._id).includes(projectId)) label += ` (owned by ${sharedProjects.owners.find(d => d._id === thisProject.userId).name})`;
        return label;
    }

    return (
        <div className={className} style={style}>
            <div style={{maxHeight: "calc(100vh - 280px)", overflowY: "auto"}} className="px-4">
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
                <div className="sm:flex items-center mt-6">
                    <input
                        type="text"
                        className="border-b my-2 py-2 mr-4 flex-grow w-full sm:w-auto"
                        placeholder="Search"
                        value={snippetSearchQuery}
                        onChange={e => {
                            setSnippetPage(1);
                            setSnippetSearchQuery(e.target.value);
                        }}
                    />
                    <Select
                        className="flex-grow sm:mr-4 mt-4 sm:mt-0"
                        options={(() => {
                            const availableTags = [...(projects ? projects.projects : []), ...(sharedProjects ? sharedProjects.projects : [])]
                                .find(d => d._id === snippetProjectId)
                                .availableTags;

                            return availableTags ? availableTags.map(d => ({label: d, value: d})) : [];
                        })()}
                        value={tagsQuery.map(d => ({label: d, value: d}))}
                        onChange={(newValue) => {
                            setSnippetPage(1);
                            setTagsQuery(newValue.map(d => d.value));
                        }}
                        placeholder="Filter by tag"
                        isMulti
                    />
                    <Select
                        className="sm:w-32 mt-4 sm:mt-0"
                        options={[
                            {value: "all", label: "All"},
                            {value: "true", label: <BiLink/>},
                            {value: "false", label: <BiUnlink/>},
                        ]}
                        value={{value: linkedQuery, label: {
                                "all": "All",
                                "true": <BiLink/>,
                                "false": <BiUnlink/>,
                            }[linkedQuery]}}
                        onChange={newValue => setLinkedQuery(newValue.value)}
                    />
                </div>
                {snippets ? snippets.snippets.length > 0 ? (
                    <>
                        <div className="flex items-center mt-8">
                            <p className="opacity-25">
                                Showing snippets {(snippetPage - 1) * 10 + 1}
                                -{(snippetPage < Math.floor(snippets.count / 10)) ? snippetPage * 10 : snippets.count} of {snippets.count}
                            </p>
                            <button
                                className="underline opacity-50 hover:opacity-100 transition flex-shrink-0 ml-auto"
                                onClick={() => {
                                    setOrderNew(!orderNew);
                                    setSnippetPage(1);
                                }}
                            >{orderNew ? "View oldest first" : "View newest first"}</button>
                        </div>
                        {snippets.snippets.map((snippet, i, a) => (
                            <div key={snippet._id}>
                                {(i === 0 || format(new Date(snippet.createdAt), "yyyy-MM-dd") !== format(new Date(a[i-1].createdAt), "yyyy-MM-dd")) && (
                                    <p className="up-ui-title mt-12 pb-4">{format(new Date(snippet.createdAt), "EEEE, MMMM d")}</p>
                                )}
                                <SnippetItemReduced
                                    snippet={snippet}
                                    authors={snippets.authors}
                                    selectedSnippetIds={selectedSnippetIds}
                                    setSelectedSnippetIds={setSelectedSnippetIds}
                                />
                            </div>
                        ))}
                        <p className="opacity-25 mt-8">
                            Showing snippets {(snippetPage - 1) * 10 + 1}
                            -{(snippetPage < Math.floor(snippets.count / 10)) ? snippetPage * 10 : snippets.count} of {snippets.count}
                        </p>
                        {snippets.count > 10 && (
                            <div className="mt-4">
                                {Array.from({length: Math.ceil(snippets.count / 10)}, (x, i) => i + 1).map(d => (
                                    <button
                                        className={"py-2 px-4 rounded-md mr-2 " + (d === snippetPage ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                                        onClick={() => setSnippetPage(d)}
                                        disabled={+d === +snippetPage}
                                    >{d}</button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="mt-8">{snippetSearchQuery ? "No snippets matching search query" : "No snippets in this project"}</p>
                ) : (
                    <Skeleton count={10}/>
                )}
            </div>
            <div className="pt-4 px-4">
                <button className="up-button text" onClick={onClose}>Done</button>
            </div>
        </div>
    );
}