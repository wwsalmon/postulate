import React, {Dispatch, SetStateAction, useState} from "react";
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObjWithCounts} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import Skeleton from "react-loading-skeleton";
import Button from "../headless/Button";

export default function ProjectBrowser({setOpen, featuredProjectIds, buttonText, onSubmit}: {
    setOpen: Dispatch<SetStateAction<boolean>>,
    featuredProjectIds: string[],
    buttonText: string,
    onSubmit: (selectedProjectId: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => any,
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {data: projects, error: postsError}: responseInterface<{ projects: DatedObj<ProjectObjWithCounts>[], count: number }, any> = useSWR(`/api/project?page=${page}&search=${searchQuery}`, fetcher);

    const projectsReady = projects && projects.projects;
    const filteredProjects = projectsReady ? projects.projects.filter(d => !featuredProjectIds.includes(d._id)) : [];

    return (
        <>
            <input
                type="text"
                className="border-b py-2 mb-8 w-full"
                placeholder="Search"
                value={searchQuery}
                onChange={e => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                }}
            />
            {projectsReady ? filteredProjects.length > 0 ? (
                <div style={{maxHeight: "calc(100vh - 400px)", overflowY: "auto"}} className="-mr-4">
                    <div className="pr-4">
                        {filteredProjects.map(project => (
                            <label htmlFor={project._id} className="flex items-center my-2 p-2 rounded-md transition hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={selectedProjectId === project._id}
                                    onChange={() => {
                                        if (selectedProjectId === project._id) setSelectedProjectId(null);
                                        else setSelectedProjectId(project._id);
                                    }}
                                    className="mr-4 w-4 h-4 flex-shrink-0"
                                    id={project._id}
                                />
                                <span><b>{project.name}</b></span>
                                <span className="opacity-50 inline-block ml-4">
                                    {project.posts.length ? project.posts[0].count : 0} post{(project.posts.length ? project.posts[0].count : 0) !== 1 ? "s" : ""}
                                </span>
                            </label>
                        ))}
                    </div>

                    {projects.count > 10 && (
                        <>
                            <p className="opacity-25 mt-8">
                                Showing projects {(page - 1) * 10 + 1}
                                -{(page < Math.floor(projects.count / 10)) ? page * 10 : projects.count} of {projects.count}
                            </p>
                            <div className="mt-4">
                                {Array.from({length: Math.ceil(projects.count / 10)}, (x, i) => i + 1).map(d => (
                                    <button
                                        className={"py-2 px-4 rounded-md mr-2 " + (d === page ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                                        onClick={() => setPage(d)}
                                        disabled={+d === +page}
                                    >{d}</button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>No matching projects found</p>
            ) : (
                <Skeleton count={1} className="h-64 md:w-1/3 sm:w-1/2 w-full"/>
            )}
            <div className="mt-4 flex items-center">
                <Button onClick={() => onSubmit(selectedProjectId, setIsLoading)} isLoading={isLoading} disabled={!selectedProjectId}>{buttonText}</Button>
                <button className="up-button text" onClick={() => setOpen(false)}>Cancel</button>
            </div>
        </>
    );
}