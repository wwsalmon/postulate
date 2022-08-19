import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../utils/types";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import H1 from "../../components/style/H1";
import H2 from "../../components/style/H2";
import H3 from "../../components/style/H3";
import SEO from "../../components/standard/SEO";
import {FiArrowRight, FiPlus, FiSearch} from "react-icons/fi";
import UiModal from "../../components/style/UiModal";
import axios from "axios";
import Link from "next/link";
import {ssr404} from "next-response-helpers";
import getThisUser from "../../utils/getThisUser";
import Container from "../../components/style/Container";
import UiButton from "../../components/style/UiButton";
import useSWR from "swr";
import UiH3 from "../../components/style/UiH3";
import {getInputStateProps} from "react-controlled-component-helpers";
import ProjectCard, {ProjectCardFeatured} from "../../components/profile/ProjectCard";
import {ProjectModel} from "../../models/project";
import {Field} from "../new/repository";
import ActivityFeed from "../../components/explore/ActivityFeed";
import ExploreNodeCard from "../../components/explore/ExploreNodeCard";
import TabButton from "../../components/style/TabButton";
import PostsFeed from "../../components/explore/PostsFeed";

function FeaturedProjectModal({
                                  pageUser,
                                  iter,
                                  setIter,
                                  isOpen,
                                  setIsOpen
                              }: { pageUser: DatedObj<UserObj>, iter: number, setIter: Dispatch<SetStateAction<number>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [projects, setProjects] = useState<DatedObj<ProjectObj>[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const {data} = useSWR<{ projects: DatedObj<ProjectObj>[] }>(`/api/search/project?userId=${pageUser._id}&query=${query}&excludeFeatured=${true}`, query ? fetcher : async () => {
        data: [];
    });

    const isDisabled = !projects.length || selectedIndex === null;

    function onSubmit() {
        if (isDisabled) return;

        setIsLoading(true);

        axios.post(`/api/project/feature`, {id: projects[selectedIndex]._id}).then(() => {
            setIsLoading(false);
            setQuery("");
            setIter(iter + 1);
            setIsOpen(false);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (data && data.projects) {
            setSelectedIndex(null);
            setProjects(data.projects);
        }
    }, [data]);

    return (
        <UiModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
            <UiH3 className="mb-2">Feature new project</UiH3>
            <Field value={query} setValue={setQuery} placeholder="Search for project by name"/>
            <div className="my-4">
                {data && data.projects.map((node, i) => (
                    <label
                        htmlFor={`radio-${node._id}`}
                        key={node._id}
                        className="flex items-center hover:bg-gray-100 transition p-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            checked={i === selectedIndex}
                            onClick={() => setSelectedIndex(i)}
                            id={`radio-${node._id}`}
                        />
                        <span className="ml-2">{node.name}</span>
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
    );
}

function UserProfileSearch({pageUser, thisUser}: { pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const [query, setQuery] = useState<string>("");

    const {data: nodeData} = useSWR<{ nodes: (DatedObj<NodeObj> & { projectArr: DatedObj<ProjectObj>[] })[] }>(`/api/search/node?userId=${pageUser._id}&query=${query}`, query ? fetcher : async () => {
        data: [];
    });
    const {data: projectData} = useSWR<{ projects: DatedObj<ProjectObj>[] }>(`/api/search/project?userId=${pageUser._id}&query=${query}`, query ? fetcher : async () => {
        data: [];
    });

    return (
        <>
            <div className="flex items-center mt-12 mb-8">
                {query && (
                    <H3>Search results</H3>
                )}
                <div className="flex items-center ml-auto">
                    <FiSearch className="mr-4 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Search repos and notes"
                        className="sm:w-48 focus:outline-none"
                        {...getInputStateProps(query, setQuery)}
                    />
                </div>
            </div>
            {query && (
                <div className="py-4 md:flex md:-mx-4">
                    <div className="md:w-1/2 md:px-4 mb-8 md:mb-0">
                        <H2 className="mb-6">Projects</H2>
                        <div className="grid grid-cols-2 gap-4">
                            {projectData && projectData.projects.map(project => (
                                <ProjectCard
                                    pageUser={pageUser}
                                    pageProject={project}
                                    thisUser={thisUser}
                                    key={project._id}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 md:px-4">
                        <H2 className="mb-6">Notes</H2>
                        {nodeData && nodeData.nodes.map(node => (
                            <ExploreNodeCard
                                pageUser={pageUser}
                                pageNode={node}
                                pageProject={node.projectArr[0]}
                                isSearch={true}
                                key={node._id}
                                className="mb-3"
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default function UserProfile({
                                        pageUser,
                                        thisUser,
                                        numProjects
                                    }: { pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, numProjects: number }) {
    type TabOption = "Latest Posts" | "All Activity";

    const [tab, setTab] = useState<TabOption>("Latest Posts");
    const [iter, setIter] = useState<number>(0);
    const {data} = useSWR<{ projects: DatedObj<ProjectObj>[] }>(`/api/project?userId=${pageUser._id}&featured=${true}&iter=${iter}`, fetcher);

    const isOwner = thisUser && thisUser._id === pageUser._id;

    const [isAddFeaturedOpen, setIsAddFeaturedOpen] = useState<boolean>(false);

    return (
        <>
            <Container>
                <SEO title={`${pageUser.name}`}/>
                <img
                    src={pageUser.image}
                    alt={`Profile picture of ${pageUser.name}`}
                    className="w-24 h-24 rounded-full mb-8"
                />
                <H1>Welcome to {pageUser.name.split(" ")[0]}'s Postulate</H1>
                <H2 className="mt-2">Repositories of open-sourced knowledge</H2>
                <div className="flex items-center mt-12 mb-8">
                    <H3>Pinned repositories</H3>
                    {isOwner && (
                        <UiButton className="ml-auto" href="/new/repository">+ New</UiButton>
                    )}
                </div>
                {numProjects === 0 && (
                    <p className="text-gray-400 my-8">No projects yet. Create one by clicking the button above!</p>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data && data.projects && data.projects.sort((
                        a,
                        b
                    ) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(project => isOwner ? (
                        <ProjectCardFeatured
                            pageUser={pageUser}
                            pageProject={project}
                            thisUser={thisUser}
                            iter={iter}
                            setIter={setIter}
                        />
                    ) : (
                        <ProjectCard pageProject={project} pageUser={pageUser} thisUser={thisUser} key={project._id}/>
                    ))}
                    {isOwner && (
                        <>
                            <button
                                className="flex items-center justify-center up-gray-300 rounded-md up-bg-gray-50 hover:bg-white hover:up-gray-700 hover:shadow transition"
                                style={{minHeight: 160}}
                                onClick={() => setIsAddFeaturedOpen(true)}
                            >
                                <div className="flex items-center justify-center rounded-full p-2 border text-sm text-gray-500">
                                    <FiPlus/>
                                    <span className="ml-2">Add featured repo</span>
                                </div>
                            </button>
                            <FeaturedProjectModal
                                pageUser={pageUser}
                                iter={iter}
                                setIter={setIter}
                                isOpen={isAddFeaturedOpen}
                                setIsOpen={setIsAddFeaturedOpen}
                            />
                        </>
                    )}
                    <Link href={`/@${pageUser.username}/repositories`}>
                        <a
                            className="flex items-center justify-center font-medium up-gray-500 hover:up-gray-700 up-bg-gray-50 rounded-md hover:bg-white hover:shadow"
                            style={{minHeight: 160, transition: "all 0.3s ease"}}
                        >
                            <span className="mr-2">All repos ({numProjects})</span>
                            <FiArrowRight/>
                        </a>
                    </Link>
                </div>
                <UserProfileSearch pageUser={pageUser} thisUser={thisUser}/>
                <div className="flex items-center mt-8 mb-4">
                    {["Latest Posts", "All Activity"].map(option => (
                        <TabButton isActive={option === tab} onClick={() => setTab(option as TabOption)} key={option}>
                            {option}
                        </TabButton>
                    ))}
                </div>
                {tab === "Latest Posts" && (
                    <PostsFeed userId={pageUser._id} className="mt-12 mb-8"/>
                )}
            </Container>
            {tab === "All Activity" && (
                <div className="w-full bg-gray-100 pt-8 border-t">
                    <Container>
                        <ActivityFeed userId={pageUser._id}/>
                    </Container>
                </div>
            )}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);

    try {
        await dbConnect();

        const pageUser = await UserModel.findOne({username: username});

        if (!pageUser) return ssr404;

        const numProjects = await ProjectModel.find({userId: pageUser._id}).countDocuments();

        const thisUser = await getThisUser(context);
if (thisUser.redirect) return thisUser.redirect;

        return {
            props: {
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                numProjects,
                key: username
            }
        };
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};