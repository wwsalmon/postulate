import React, {Dispatch, SetStateAction, useState} from 'react';
import useSWR, {responseInterface} from "swr";
import {DatedObj, ProjectObjWithCounts} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import Link from "next/link";
import Router, {useRouter} from "next/router";

export default function NavbarSwitcher({setOpen}: { setOpen: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const {data: projects, error: postsError}: responseInterface<{ projects: DatedObj<ProjectObjWithCounts>[], count: number }, any> = useSWR(`/api/project?search=${searchQuery}&page=1`, fetcher);

    Router.events.on("routeChangeComplete", () => {
        setOpen(false);
    });

    return (
        <>
            <input
                type="text"
                className="border p-2 mb-4 w-full rounded-md"
                placeholder="Go to project"
                value={searchQuery}
                onChange={e => {
                    setSelectedIndex(0);
                    setSearchQuery(e.target.value);
                }}
                onKeyDown={e => {
                    const itemsMax = projects ? projects.projects ? projects.projects.length : 0 : 0;
                    if (e.key === "ArrowDown" && itemsMax > 1) {
                        setSelectedIndex((selectedIndex + 1 < itemsMax) ? selectedIndex + 1 : 0);
                    } else if (e.key === "ArrowUp" && itemsMax > 1) {
                        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : itemsMax - 1);
                    } else if (e.key === "Enter") {
                        if (projects && projects.projects && projects.projects.length) {
                            router.push(`/projects/${projects.projects[selectedIndex]._id}`).then(() => setOpen(false));
                        }
                    }
                }}
                autoFocus
            />
            {projects && projects.projects && projects.projects.length ? (
                <>
                    {projects.projects.map((project, i) => (
                        <Link href={`/projects/${project._id}`} key={project._id}>
                            <a className={`block px-4 -mx-4 py-3 ${i === 9 ? "" : "border-b"} up-border-gray-200 hover:up-bg-gray-100 ${i === selectedIndex ? "up-bg-gray-100" : ""}`}>
                                {project.name}
                            </a>
                        </Link>
                    ))}
                </>
            ) : (
                <p className="up-gray-400">No results found</p>
            )}
        </>
    );
}