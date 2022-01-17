import SEO from "../standard/SEO";
import InlineButton from "../style/InlineButton";
import H1 from "../style/H1";
import H2 from "../style/H2";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import UiButton from "../style/UiButton";
import Button from "../headless/Button";
import Container from "../style/Container";
import {useRouter} from "next/router";
import {MoreMenu, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import SnippetsBar from "./SnippetsBar";
import UiModal from "../style/UiModal";
import UiH3 from "../style/UiH3";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {DatedObj, NodeObj, NodeTypes, ProjectObj, ShortcutObj} from "../../utils/types";
import {getInputStateProps, getSelectStateProps} from "react-controlled-component-helpers";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import {ProjectPageProps} from "../../utils/getPublicNodeSSRFunction";

export type NodeWithShortcut = NodeObj & {shortcutArr?: DatedObj<ShortcutObj>[], orrProjectArr?: DatedObj<ProjectObj>[]};

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

    const {data} = useSWR<{nodes: DatedObj<NodeObj>[]}>(
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
                <p className="text-sm text-gray-500 font-manrope font-semibold mr-3">From project</p>
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
                    placeholder="Search for project in account"
                    styles={{dropdownIndicator: () => ({display: "none"})}}
                    onChange={selected => setProject(selected)}
                    value={project}
                    className="flex-grow"
                />
            </div>
            <div className="flex items-center my-4">
                <select {...getSelectStateProps(type, setType)} className="focus:outline-none py-1 px-2 border border-gray-300 rounded-md mr-2">
                    {["Post", "Evergreen", "Source"].map(type => (
                        <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                </select>
                <input
                    type="text"
                    className="focus:outline-none py-1 px-2 border border-gray-300 rounded-md flex-grow-1 w-full"
                    placeholder={`Search for ${type} by title`}
                    {...getInputStateProps(query, setQuery)}
                />
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

export default function MainShell({pageProject, pageUser, thisUser, children}: ProjectPageProps & {children: ReactNode}) {
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const {pathname} = useRouter();
    const pageTab = pathname.split("/")[pathname.split("/").length - 1];

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const Tabs = () => (
        <div className="overflow-x-auto">
            {["Home", "Posts", "Evergreens", "Sources"].map(tab => (
                <Button
                    key={`project-tab-${tab}`}
                    className={`uppercase font-semibold text-sm tracking-wider mr-6 ${((tab.toLowerCase() === pageTab) || (tab === "Home" && pageTab === "[projectUrlName]")) ? "" : "text-gray-400"}`}
                    href={`${getProjectUrl(pageUser, pageProject)}${tab === "Home" ? "" : "/" + tab.toLowerCase()}`}
                >
                    {tab}
                </Button>
            ))}
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
            <SEO title={pageProject.name}/>
            <div className="items-center mb-8 flex">
                <InlineButton href={`/@${pageUser.username}`} light={true}>
                    {pageUser.name}
                </InlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <H1>{pageProject.name}</H1>
                {pageProject.description && (
                    <H2 className="mt-2">{pageProject.description}</H2>
                )}
            </div>
            <div className="my-12 md:flex items-center">
                <div className="ml-auto flex items-center order-2 w-full md:w-auto mb-6 md:mb-0">
                    <div className="flex items-center">
                        <FiSearch className="mr-4 text-gray-400"/>
                        <input type="text" placeholder="Search" className="w-24 focus:outline-none"/>
                    </div>
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
            {children}
            <SnippetsBar pageProject={pageProject} pageUser={pageUser} thisUser={thisUser}/>
        </Container>
    );
}