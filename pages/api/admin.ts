import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {SnippetModel} from "../../models/snippet";
import {PostModel} from "../../models/post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({message: "wrong method"});
    const session = await getSession({req});
    if (!session || session.user.email !== "wwsamson12309@gmail.com") return res.status(403).json({message: "unauthed"});

    try {
        await dbConnect();

        const users = await UserModel.aggregate([
            {
                $lookup: {
                    from: "posts",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        {$project: {"createdAt": 1, "linkedPosts": 1}},
                    ],
                    as: "postsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetsArr",
                }
            },
            {
                $lookup: {
                    from: "projects",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "projects",
                }
            },
            {$project: {"name": 1, "email": 1, "username": 1, "image": 1, "createdAt": 1, "postsArr": 1, "snippetsArr": 1, "projects": 1}}
        ]);

        const snippetTexts = await SnippetModel.aggregate([
            {$project: {"body": 1}}
        ]);

        const postTexts = await PostModel.aggregate([
            {$project: {"body": 1}}
        ]);

        const snippetTextLength = snippetTexts.reduce((a, b) => a + b.body ? b.body.split(" ").length : 0, 0);
        const postTextLength = postTexts.reduce((a, b) => a + b.body ? b.body.split(" ").length : 0, 0);

        return res.status(200).json({data: users, wordCount: snippetTextLength + postTextLength});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}