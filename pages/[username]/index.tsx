import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, UserObjWithGraphAggregationPipeline} from "../../utils/utils";
import {DatedObj, ProjectObjWithStats, UserObjGraph} from "../../utils/types";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import H1 from "../../components/style/H1";
import H2 from "../../components/style/H2";
import H4 from "../../components/style/H4";
import UpSEO from "../../components/standard/UpSEO";
import ProfileProjectItem from "../../components/profile/ProfileProjectItem";
import {FiArrowRight, FiPlus} from "react-icons/fi";
import {useSession} from "next-auth/client";
import UpModal from "../../components/style/UpModal";
import axios from "axios";
import ProjectBrowser from "../../components/profile/ProjectBrowser";
import Link from "next/link";

export default function UserProfile({thisUser}: { thisUser: DatedObj<UserObjGraph> }) {
    const [session, loading] = useSession();
    const [addFeaturedOpen, setAddFeaturedOpen] = useState<boolean>(false);
    const [featuredIter, setFeaturedIter] = useState<number>(0);
    const [featuredProjects, setFeaturedProjects] = useState<DatedObj<ProjectObjWithStats>[]>(thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id)));
    const isOwner = session && (session.userId === thisUser._id);

    useEffect(() => {
        axios.get(`/api/project?userId=${thisUser._id}&featured=true`).then(res => {
            setFeaturedProjects(res.data.projects);
        }).catch(e => console.log(e));
    }, [featuredIter]);

    function onSubmitFeaturedProject(selectedProjectId: string, setIsLoading: Dispatch<SetStateAction<boolean>>){
        setIsLoading(true);

        axios.post(`/api/project/feature`, {id: selectedProjectId}).then(() => {
            setIsLoading(false);
            setFeaturedIter(featuredIter + 1);
            setAddFeaturedOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto">
            <UpSEO title={`${thisUser.name}`}/>
            <H1>Welcome to {thisUser.name.split(" ")[0]}'s Postulate</H1>
            <H2 className="mt-2">Repositories of open-sourced knowledge</H2>
            <H4 className="mt-12 mb-8">Pinned repositories</H4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProjects.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(project => (
                    <ProfileProjectItem
                        project={project}
                        thisUser={thisUser}
                        iter={featuredIter}
                        setIter={setFeaturedIter}
                    />
                ))}
                {isOwner && (
                    <>
                        <button
                            className="flex items-center justify-center up-gray-300 rounded-md up-bg-gray-50 hover:bg-white hover:up-gray-700 hover:shadow transition"
                            style={{minHeight: 160}}
                            onClick={() => setAddFeaturedOpen(true)}
                        >
                            <div className="flex items-center justify-center rounded-full h-8 w-8 border">
                                <FiPlus/>
                            </div>
                        </button>
                        <UpModal isOpen={addFeaturedOpen} setIsOpen={setAddFeaturedOpen} wide={true}>
                            <h3 className="up-ui-title mb-4">Select a project to feature</h3>
                            <ProjectBrowser
                                setOpen={setAddFeaturedOpen}
                                featuredProjectIds={featuredProjects.map(d => d._id)}
                                buttonText="Add"
                                onSubmit={onSubmitFeaturedProject}
                            />
                        </UpModal>
                    </>
                )}
                <Link href={`/@${thisUser.username}/projects`}>
                    <a
                        className="flex items-center justify-center font-medium up-gray-500 hover:up-gray-700 up-bg-gray-50 rounded-md hover:bg-white hover:shadow"
                        style={{minHeight: 160, transition: "all 0.3s ease"}}
                    >
                        <span className="mr-2">All projects ({thisUser.projectsArr.length})</span>
                        <FiArrowRight/>
                    </a>
                </Link>
            </div>
        </div>
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

        const userObj = await UserModel.aggregate([
            {$match: {username: username}},
            ...UserObjWithGraphAggregationPipeline,
        ]);

        if (!userObj.length) return { notFound: true };

        return { props: { thisUser: cleanForJSON(userObj[0]), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}