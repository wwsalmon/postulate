import React from "react";
import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON} from "../../../utils/utils";
import {DatedObj, ProjectObjWithPageStats, UserObjWithProjects} from "../../../utils/types";
import H1 from "../../../components/style/H1";
import H2 from "../../../components/style/H2";
import UpInlineButton from "../../../components/style/UpInlineButton";
import UpSEO from "../../../components/standard/UpSEO";
import {useSession} from "next-auth/client";
import Container from "../../../components/style/Container";

export default function ProjectPage({projectData, thisUser}: { projectData: DatedObj<ProjectObjWithPageStats>, thisUser: DatedObj<UserObjWithProjects>}) {
    const [session, loading] = useSession();

    const isOwner = session && session.userId === projectData.userId;

    return (
        <Container>
            <UpSEO title={projectData.name}/>
            <div className="items-center mb-8 hidden lg:flex">
                <UpInlineButton href={`/@${thisUser.username}`} light={true}>
                    {thisUser.name}
                </UpInlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <H1>{projectData.name}</H1>
                {projectData.description && (
                    <H2 className="mt-2">{projectData.description}</H2>
                )}
            </div>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const userArr = await UserModel.aggregate([
            {$match: {username: username}},
            {$lookup:
                    {
                        from: "projects",
                        foreignField: "userId",
                        localField: "_id",
                        as: "projectsArr",
                    }
            },
        ]);

        if (!userArr.length) return { notFound: true };

        const thisUser = userArr[0];

        const projectData = await ProjectModel.aggregate([
            {$match: {userId: thisUser._id, urlName: projectUrlName }},
            {
                $lookup: {
                    from: "posts",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "postsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [
                                        {$eq: ["$projectId", "$$projectId"]},
                                        {$ne: ["$linkedPosts", []]},
                                    ]}}},
                        {$count: "count"},
                    ],
                    as: "linkedSnippetsArr",
                }
            },
        ]);

        if (!projectData.length) return { notFound: true };

        return { props: { projectData: cleanForJSON(projectData[0]), thisUser: cleanForJSON(thisUser), key: projectUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};