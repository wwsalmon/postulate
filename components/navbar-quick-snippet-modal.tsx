import SnippetEditor from "./snippet-editor";
import React, {Dispatch, SetStateAction, useState} from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObj, UserObj} from "../utils/types";
import {fetcher} from "../utils/utils";
import Select from "react-select";
import axios from "axios";
import {useRouter} from "next/router";

export default function NavbarQuickSnippetModal({setOpen}: { setOpen: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [instance, setInstance] = useState<EasyMDE>(null);
    const [isSnippet, setIsSnippet] = useState<boolean>(true);
    const [projectId, setProjectId] = useState<string>("none");

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

    function onSubmit(urlName: string, isSnippet: boolean, body: string, url: string, tags: string[]) {
        setIsLoading(true);

        axios.post("/api/snippet", {
            projectId: projectId,
            urlName: urlName,
            type: isSnippet ? "snippet" : "resource",
            body: body || "",
            url: url || "",
            tags: tags || [],
        }).then(res => {
            instance.clearAutosavedValue();
            setIsLoading(false);
            setIsSnippet(true);
            setOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onCancelSnippetOrResource(urlName: string) {
        instance.clearAutosavedValue();
        setIsSnippet(true);
        axios.post("/api/cancel-delete-images", {urlName: urlName}).catch(e => console.log(e));
        setOpen(false);
    }

    return (
        <div style={{maxHeight: "calc(100vh - 200px)", overflowY: "auto"}} className="-mx-4 px-4 modal-editor">
            <h2 className="up-ui-title mb-6">Quick snippet</h2>
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
            <div className="flex mb-6">
                <button
                    className={`up-button small ml-auto ${isSnippet ? "" : "text"}`}
                    onClick={() => setIsSnippet(!isSnippet)}
                >
                    {isSnippet ? "Add" : "Remove"} link
                </button>
            </div>
            <SnippetEditor
                isSnippet={isSnippet}
                availableTags={getProjectTags(projectId)}
                projectId={projectId}
                isLoading={isLoading}
                onSaveEdit={onSubmit}
                onCancelEdit={onCancelSnippetOrResource}
                setInstance={setInstance}
                disableSave={projectId === "none"}
            />
        </div>
    );
}