import {GetServerSideProps} from "next";
import {UserModel} from "../../../../models/user";
import React from "react";
import {getSession} from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";

export default function RedirectPage() { return <></> }

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        Array.isArray(context.params.postUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;
    const postUrlName: string = context.params.postUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const graphObj = await UserModel.aggregate([
            {$match: { "username": username }},
            {
                $lookup: {
                    from: "projects",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [{$eq: ["$userId", "$$userId"]}, {$eq: ["$urlName", encodeURIComponent(projectUrlName)]}]}}},
                        {
                            $lookup: {
                                from: "posts",
                                let: {"projectId": "$_id"},
                                pipeline: [
                                    {$match: {$expr: {$and: [{$eq: ["$projectId", "$$projectId"]}, {$eq: ["$urlName", encodeURIComponent(postUrlName)]}]}}},
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: {"userId": "$userId"},
                                            pipeline: [
                                                {$match: {$expr: {$eq: ["$_id", "$$userId"]}}},
                                                {$group: {_id: username}}
                                            ],
                                            as: "authorArr",
                                        }
                                    }
                                ],
                                as: "postArr",
                            }
                        }
                    ],
                    as: "projectArr",
                }
            },
        ]);

        // return 404 if missing object at any stage
        if (!graphObj.length || !graphObj[0].projectArr.length || !graphObj[0].projectArr[0].postArr.length || !graphObj[0].projectArr[0].postArr[0].authorArr.length) {
            return { notFound: true };
        }

        const thisProject = graphObj[0].projectArr[0];
        const thisPost = thisProject.postArr[0];
        const thisAuthor = thisPost.authorArr[0];

        if (thisPost.privacy === "private") {
            const session = await getSession(context);

            if (!session) return { notFound: true };

            const isOwner = session.userId === thisPost.userId.toString();
            const isCollaborator = thisProject.collaborators.map(d => d.toString()).includes(session.userId);

            if (!isOwner && !isCollaborator) return { notFound: true };
        }

        context.res.setHeader("location", `/@${thisAuthor._id}/p/${encodeURIComponent(postUrlName)}`);
        context.res.statusCode = 302;
        context.res.end();
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};