import SnippetEditor from "./snippet-editor";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObj, UserObj} from "../utils/types";
import {fetcher} from "../utils/utils";
import Select from "react-select";
import axios from "axios";
import {Node} from "slate";

export default function NavbarQuickSnippetModal({setOpen, initProjectId, iteration, setIteration, callback, initBody, startNode, isQuick}: {
    setOpen: Dispatch<SetStateAction<boolean>>,
    initProjectId?: string,
    iteration?: number,
    setIteration?: Dispatch<SetStateAction<number>>,
    callback?: () => void,
    initBody?: Node[],
    startNode?: number,
    isQuick?: boolean,
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSnippet, setIsSnippet] = useState<boolean>(true);
    const [projectId, setProjectId] = useState<string>(initProjectId || "none");

    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObj>[] }, any> = useSWR(`/api/project`, fetcher);
    const {data: sharedProjects, error: sharedProjectsError}: responseInterface<{projects: DatedObj<ProjectObj>[], owners: DatedObj<UserObj>[] }, any> = useSWR("/api/project?shared=true", fetcher);

    function getProjectLabel(projectId: string): string {
        if (!(projects && sharedProjects && (projects.projects.length + sharedProjects.projects.length > 0))) return "";
        const thisProject: DatedObj<ProjectObj> = [...projects.projects, ...sharedProjects.projects].find(d => d._id === projectId);
        if (!thisProject) return "";
        let label = thisProject.name;
        if (sharedProjects.projects.map(d => d._id).includes(projectId)) label += ` (owned by ${sharedProjects.owners.find(d => d._id === thisProject.userId).name})`;
        return label;
    }

    function getProjectTags(projectId: string): string[] {
        if (!(projects && sharedProjects && (projects.projects.length + sharedProjects.projects.length > 0))) return [];
        const thisProject: DatedObj<ProjectObj> = [...projects.projects, ...sharedProjects.projects].find(d => d._id === projectId);
        return thisProject ? thisProject.availableTags : [];
    }

    function onSubmit(urlName: string, isSnippet: boolean, body: string | Node[], url: string, tags: string[], isSlate: boolean) {
        setIsLoading(true);

        axios.post("/api/snippet", {
            projectId: projectId,
            urlName: urlName,
            type: isSnippet ? "snippet" : "resource",
            body: body || "",
            url: url || "",
            tags: tags || [],
            isSlate: isSlate,
        }).then(() => {
            // @ts-ignore
            window.analytics.track("Item created", {
                type: "snippet",
                projectId: projectId,
            });
            localStorage.removeItem(isQuick ? "postulateQuickSnippetBody" : "postulateSnippetBody");
            callback && callback();
            setIsLoading(false);
            setIsSnippet(true);
            if (setIteration) setIteration(iteration + 1);
            setOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelSnippetOrResource(urlName: string) {
        setIsSnippet(true);
        axios.post("/api/cancel-delete-images", {urlName: urlName}).catch(e => console.log(e));
        setOpen(false);
    }

    return (
        <div style={{maxHeight: "calc(100vh - 200px)", overflowY: "auto"}} className="-mx-4 px-4 modal-editor">
            <h2 className="up-ui-title mb-6">{initProjectId ? "New snippet" : "Quick snippet"}</h2>
            {!initProjectId && (
                <>
                    <hr className="my-6"/>
                    <h2 className="up-ui-title mb-6">Project</h2>
                    <Select
                        options={[
                            ...((projects && projects.projects && projects.projects.length > 0) ? projects.projects.map(project => ({
                                value: project._id,
                                label: getProjectLabel(project._id),
                            })) : []),
                            ...((sharedProjects && sharedProjects.projects && sharedProjects.projects.length > 0) ? sharedProjects.projects.map(project => ({
                                value: project._id,
                                label: getProjectLabel(project._id),
                            })) : []),
                        ]}
                        value={{
                            value: projectId,
                            label:getProjectLabel(projectId)
                        }}
                        onChange={option => setProjectId(option.value)}
                        styles={{
                            menu: provided => ({...provided, zIndex: 6}),
                        }}
                    />
                    <hr className="my-6"/>
                </>
            )}
            <SnippetEditor
                isSnippet={isSnippet}
                availableTags={getProjectTags(projectId)}
                projectId={projectId}
                isLoading={isLoading}
                onSaveEdit={onSubmit}
                onCancelEdit={onCancelSnippetOrResource}
                disableSave={projectId === "none"}
                initBody={initBody}
                startNode={startNode}
                isQuick={!!isQuick}
            />
        </div>
    );
}