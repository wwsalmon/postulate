import SEO from "../standard/SEO";
import H1 from "../style/H1";
import H2 from "../style/H2";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import UiButton from "../style/UiButton";
import Button from "../headless/Button";
import Container from "../style/Container";
import {useRouter} from "next/router";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import SnippetsBar from "./SnippetsBar";
import UiModal from "../style/UiModal";
import UiH3 from "../style/UiH3";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {DatedObj, NodeObj, NodeObjPublic, NodeTypes, ProjectObj, ShortcutObj} from "../../utils/types";
import {getInputStateProps, getSelectStateProps} from "react-controlled-component-helpers";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import {ProjectPageProps} from "../../utils/getPublicNodeSSRFunction";
import UserButton from "../standard/UserButton";
import ConfirmModal from "../standard/ConfirmModal";
import {Field} from "../../pages/new/repository";
import {Portal} from "react-portal";
import ExploreNodeCard from "../explore/ExploreNodeCard";
import H3 from "../style/H3";
import PublicNavbar from "./PublicNavbar";
import TabButton from "../style/TabButton";

export type NodeWithShortcut = NodeObj & {shortcut?: DatedObj<ShortcutObj>, project?: DatedObj<ProjectObj>};

function NewShortcutModal({pageProject, pageUser, thisUser, isOpen, setIsOpen}: ProjectPageProps & {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
    const router = useRouter();

    const [query, setQuery] = useState<string>("");
    const [project, setProject] = useState<{label: string, value: string} | null>(null);
    const [type, setType] = useState<NodeTypes>("post");
    const [nodes, setNodes] = useState<DatedObj<NodeObj>[]>([]);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isDisabled = !nodes.length || selectedIndex === null;

    function onSubmit() {
        if (isDisabled) return;

        const currType = type;

        setIsLoading(true);

        axios.post("/api/shortcut", {
            projectId: pageProject._id,
            targetId: nodes[selectedIndex]._id,
        }).then(() => {
            const currAsPath = router.asPath;

            router.replace(`${getProjectUrl(pageUser, pageProject)}/${currType}s?refresh=true`, null).then(() => {
                if (router.asPath === currAsPath) {
                    setIsLoading(false);
                    setIsOpen(false);
                }
            });
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    const {data} = useSWR<{nodes: DatedObj<NodeObjPublic>[]}>(
        `/api/search/shortcutNode?query=${query}&projectId=${project ? project.value : ""}&thisProjectId=${pageProject._id}&type=${type}`,
        project ? fetcher : async () => ({nodes: []})
    );

    useEffect(() => {
        if (data && data.nodes) {
            setSelectedIndex(null);
            setNodes(data.nodes);
        }
    }, [data]);

    return (
        <UiModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
            <UiH3>New shortcut</UiH3>
            <div className="flex items-center my-4">
                <p className="text-sm text-gray-500 font-manrope font-semibold mr-3">From repo</p>
                <AsyncSelect
                    cacheOtions
                    loadOptions={(input, callback) => {
                        if (input) {
                            axios.get(`/api/search/project?userId=${thisUser._id}&query=${input}`).then(({data: {projects}}) => {
                                callback(projects.filter(d => d._id !== pageProject._id).map(d => ({label: d.name, value: d._id})));
                            }).catch(e => {
                                console.log(e);
                            });
                        } else {
                            callback([]);
                        }
                    }}
                    placeholder="Search for repository in account"
                    styles={{dropdownIndicator: () => ({display: "none"})}}
                    onChange={selected => setProject(selected)}
                    value={project}
                    className="flex-grow"
                />
            </div>
            <div className="flex items-center my-4">
                <select {...getSelectStateProps(type, setType)} className="focus:outline-none p-2 border border-gray-300 rounded-md mr-2">
                    {["Post", "Evergreen", "Source"].map(type => (
                        <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                </select>
                <Field value={query} setValue={setQuery} placeholder={`Search for ${type} by title`}/>
            </div>
            <div className="my-4">
                {data && data.nodes.map((node, i) => (
                    <label htmlFor={`radio-${node._id}`} key={node._id} className="flex items-center hover:bg-gray-100 transition p-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={i === selectedIndex}
                            onClick={() => setSelectedIndex(i)}
                            id={`radio-${node._id}`}
                        />
                        <span className="ml-2">{node.body.publishedTitle}</span>
                    </label>
                ))}
            </div>
            <UiButton onClick={onSubmit} disabled={isDisabled} isLoading={isLoading}>
                Add
            </UiButton>
            <UiButton noBg={true} onClick={() => setIsOpen(false)} disabled={isLoading} className="ml-2">
                Cancel
            </UiButton>
        </UiModal>
    )
}

function MainShellSearch({pageProject, pageUser, thisUser}: ProjectPageProps) {
    const [query, setQuery] = useState<string>("");

    const {data: nodeData} = useSWR<{ nodes: (DatedObj<NodeObj> & { projectArr: DatedObj<ProjectObj>[] })[] }>(`/api/search/node?projectId=${pageProject._id}&query=${query}`, query ? fetcher : async () => {
        data: [];
    });

    return (
        <>
            <div className="flex items-center">
                <FiSearch className="mr-4 text-gray-400"/>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-24 focus:outline-none" {...getInputStateProps(query, setQuery)}
                />
            </div>
            {query && (
                <Portal node={process.browser && document && document.getElementById("mainshell-before-children")}>
                    <div className="mb-16">
                        <H3 className="mb-4">Search results for "{query}"</H3>
                        {nodeData && nodeData.nodes.map(node => (
                            <ExploreNodeCard
                                pageUser={pageUser}
                                pageNode={node}
                                pageProject={pageProject}
                                isSearch={true}
                                key={node._id}
                                className="my-3"
                            />
                        ))}
                    </div>
                </Portal>
            )}
        </>
    );
}

export default function MainShell({pageProject, pageUser, thisUser, children}: ProjectPageProps & {children: ReactNode}) {
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const router = useRouter();
    const pageTab = router.pathname.split("/")[router.pathname.split("/").length - 1];

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    function onDelete() {
        if (!isOwner) return;

        setIsDeleteLoading(true);

        axios.delete("/api/project", {data: {id: pageProject._id}}).then(() => {
            router.push(`/@${thisUser.username}/repositories`);
        }).catch(e => {
            console.log(e);
            setIsDeleteLoading(false);
        });
    }

    const Tabs = () => (
        <div className="overflow-x-auto">
            <div className="flex items-center">
                {["Home", "Posts", "Evergreens", "Sources"].map(tab => (
                    <TabButton
                        key={`project-tab-${tab}`}
                        href={`${getProjectUrl(pageUser, pageProject)}${tab === "Home" ? "" : "/" + tab.toLowerCase()}`}
                        isActive={(tab.toLowerCase() === pageTab) || (tab === "Home" && pageTab === "[projectUrlName]")}
                    >
                        {tab}
                    </TabButton>
                ))}
            </div>
        </div>
    );

    const MoreActions = () => (
        <MoreMenu
            button={(
                <UiButton childClassName="flex items-center">
                    <span className="mr-1">New</span>
                    <FiChevronDown/>
                </UiButton>
            )}
            className="ml-auto md:ml-0"
        >
            {["Post", "Evergreen", "Source"].map(type => (
                <MoreMenuItem
                    href={`${getProjectUrl(pageUser, pageProject)}/new/${type.toLowerCase()}`}
                    key={`project-new-${type}`}
                    block={true}
                >
                    {type}
                </MoreMenuItem>
            ))}
            <MoreMenuItem onClick={() => setIsOpen(true)}>
                Shortcut
            </MoreMenuItem>
        </MoreMenu>
    );

    return (
        <Container>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
            <SEO title={pageProject.name}/>
            <div className="items-center mb-8 flex">
                <UserButton user={pageUser}/>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <div className="flex items-center">
                    <H1>{pageProject.name}</H1>
                    {isOwner && (
                        <>
                            <ConfirmModal
                                isOpen={isDeleteOpen}
                                setIsOpen={setIsDeleteOpen}
                                isLoading={isDeleteLoading}
                                setIsLoading={setIsDeleteLoading}
                                onConfirm={onDelete}
                                confirmText="Delete"
                                colorClass="bg-red-500 hover:bg-red-700"
                            >
                                <p className="my-2">Are you sure you want to delete the project <b>{pageProject.name}</b>?</p>
                                <p className="my-2 font-bold">This will delete all posts, evergreens, sources, and snippets attached to the project as well.</p>
                            </ConfirmModal>
                            <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                                <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/settings`}>Settings</MoreMenuItem>
                                <MoreMenuItem onClick={() => setIsDeleteOpen(true)}>Delete</MoreMenuItem>
                            </MoreMenu>
                        </>
                    )}
                </div>
                {pageProject.description && (
                    <H2 className="mt-2">{pageProject.description}</H2>
                )}
            </div>
            <div className="my-12 md:flex items-center">
                <div className="ml-auto flex items-center order-2 w-full md:w-auto mb-6 md:mb-0">
                    <MainShellSearch pageUser={pageUser} pageProject={pageProject} thisUser={thisUser}/>
                    {isOwner && (
                        <>
                            <MoreActions/>
                            <NewShortcutModal
                                pageUser={pageUser}
                                pageProject={pageProject}
                                thisUser={thisUser}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                            />
                        </>
                    )}
                </div>
                <Tabs/>
            </div>
            <div id="mainshell-before-children"/>
            {children}
            <SnippetsBar pageProject={pageProject} pageUser={pageUser} thisUser={thisUser}/>
        </Container>
    );
}