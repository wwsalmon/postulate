import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import InlineButton from "../../components/style/InlineButton";
import React from "react";
import H1 from "../../components/style/H1";
import Container from "../../components/style/Container";
import {ssr404} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import getThisUser from "../../utils/getThisUser";
import ProjectCard from "../../components/profile/ProjectCard";
import UiButton from "../../components/style/UiButton";
import UserButton from "../../components/standard/UserButton";
import SEO from "../../components/standard/SEO";

export default function Repositories({pageUser, thisUser, projects}: { pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, projects: DatedObj<ProjectObj>[] }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    return (
        <Container>
            <SEO title={`${pageUser.name}'s repositories`}/>
            <div className="flex items-center mb-8">
                <UserButton user={pageUser}/>
                <span className="mx-2 text-gray-300">/</span>
            </div>
            <div className="flex items-center">
                <H1>All repositories</H1>
                {isOwner && (
                    <UiButton className="ml-auto" href="/new/repository">+ New</UiButton>
                )}
            </div>
            {projects.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-12">
                    {projects.map(project => (
                        <ProjectCard pageUser={pageUser} pageProject={project} thisUser={thisUser} key={project._id}/>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 mt-8">No repositories yet. Create one by clicking the button above!</p>
            )}

        </Container>
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

        const projects = await ProjectModel.find({userId: pageUser._id}).sort({updatedAt: -1});

        const thisUser = await getThisUser(context);
if (thisUser.redirect) return thisUser.redirect;

        return { props: { pageUser: cleanForJSON(pageUser), thisUser: cleanForJSON(thisUser), projects: cleanForJSON(projects), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}