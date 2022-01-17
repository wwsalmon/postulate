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

export default function Projects({pageUser, thisUser, projects}: { pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, projects: DatedObj<ProjectObj>[] }) {
    return (
        <Container>
            <div className="flex items-center mb-8">
                <InlineButton href={`/@${pageUser.username}`} light={true}>
                    {pageUser.name}
                </InlineButton>
                <span className="mx-2 text-gray-300">/</span>
            </div>
            <H1>All projects</H1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-12">
                {projects.map(project => (
                    <div key={project._id} className="border">
                        <p>{project.name}</p>
                    </div>
                ))}
            </div>
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

        const projects = await ProjectModel.find({userId: pageUser._id});

        const thisUser = await getThisUser(context);

        return { props: { pageUser: cleanForJSON(pageUser), thisUser: cleanForJSON(thisUser), projects: cleanForJSON(projects), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}