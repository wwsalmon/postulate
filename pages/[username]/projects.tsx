import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON, projectWithStatsGraphStages} from "../../utils/utils";
import {DatedObj, UserObjWithProjects} from "../../utils/types";
import InlineButton from "../../components/style/InlineButton";
import React from "react";
import H1 from "../../components/style/H1";
import ProfileProjectItem from "../../components/profile/ProfileProjectItem";
import Container from "../../components/style/Container";

export default function Projects({thisUser}: { thisUser: DatedObj<UserObjWithProjects> }) {
    return (
        <Container>
            <div className="flex items-center mb-8">
                <InlineButton href={`/@${thisUser.username}`} light={true}>
                    {thisUser.name}
                </InlineButton>
                <span className="mx-2 text-gray-300">/</span>
            </div>
            <H1>All projects</H1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-12">
                {thisUser.projectsArr.map(project => (
                    <ProfileProjectItem
                        project={project}
                        thisUser={thisUser}
                        all={true}
                    />
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

        const userObj = await UserModel.aggregate([
            {$match: {username: username}},
            {$lookup:
                {
                    from: "projects",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        ...projectWithStatsGraphStages,
                    ],
                    as: "projectsArr",
                },
            },
        ]);

        if (!userObj.length) return { notFound: true };

        return { props: { thisUser: cleanForJSON(userObj[0]), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}