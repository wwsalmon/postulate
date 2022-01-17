import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, fetcher} from "../../utils/utils";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import H1 from "../../components/style/H1";
import H2 from "../../components/style/H2";
import H3 from "../../components/style/H3";
import SEO from "../../components/standard/SEO";
import {FiArrowRight, FiPlus} from "react-icons/fi";
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

function FeaturedProjectModal({pageUser, iter, setIter, isOpen, setIsOpen}: { pageUser: DatedObj<UserObj>, iter: number, setIter: Dispatch<SetStateAction<number>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [projects, setProjects] = useState<DatedObj<ProjectObj>[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const {data} = useSWR<{projects: DatedObj<ProjectObj>[]}>(`/api/search/project?userId=${pageUser._id}&query=${query}&excludeFeatured=${true}`, fetcher);

    const isDisabled = !projects.length || selectedIndex === null;

    function onSubmit(){
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
            <UiH3>Feature new project</UiH3>
            <input
                type="text"
                className="focus:outline-none py-1 px-2 border border-gray-300 rounded-md flex-grow-1 w-full"
                placeholder={`Search for project by name`}
                {...getInputStateProps(query, setQuery)}
            />
            <div className="my-4">
                {data && data.projects.map((node, i) => (
                    <label htmlFor={`radio-${node._id}`} key={node._id} className="flex items-center hover:bg-gray-100 transition p-2 cursor-pointer">
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
    )
}

export default function UserProfile({pageUser, thisUser}: { pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const [iter, setIter] = useState<number>(0);

    const {data} = useSWR<{projects: DatedObj<ProjectObj>[]}>(`/api/project?userId=${pageUser._id}&featured=${true}&iter=${iter}`, fetcher);

    const isOwner = thisUser && thisUser._id === pageUser._id;

    const [isAddFeaturedOpen, setIsAddFeaturedOpen] = useState<boolean>(false);

    return (
        <Container>
            <SEO title={`${pageUser.name}`}/>
            <img src={pageUser.image} alt={`Profile picture of ${pageUser.name}`} className="w-24 h-24 rounded-full mb-8"/>
            <H1>Welcome to {pageUser.name.split(" ")[0]}'s Postulate</H1>
            <H2 className="mt-2">Repositories of open-sourced knowledge</H2>
            <div className="flex items-center mt-12 mb-8">
                <H3>Pinned repositories</H3>
                {isOwner && (
                    <UiButton className="ml-auto">+ New</UiButton>
                )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data && data.projects && data.projects.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(project => isOwner ? (
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
                            <div className="flex items-center justify-center rounded-full h-8 w-8 border">
                                <FiPlus/>
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
                <Link href={`/@${pageUser.username}/projects`}>
                    <a
                        className="flex items-center justify-center font-medium up-gray-500 hover:up-gray-700 up-bg-gray-50 rounded-md hover:bg-white hover:shadow"
                        style={{minHeight: 160, transition: "all 0.3s ease"}}
                    >
                        <span className="mr-2">All projects</span>
                        <FiArrowRight/>
                    </a>
                </Link>
            </div>
        </Container>
    )
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

        const thisUser = await getThisUser(context);

        return { props: { pageUser: cleanForJSON(pageUser), thisUser: cleanForJSON(thisUser), key: username }};
    } catch (e) {
        console.log(e);
        return ssr404;
    }
}