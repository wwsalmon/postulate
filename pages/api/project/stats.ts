import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../utils/dbConnect";
import {ProjectModel} from "../../../models/project";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406).json({message: "missing project ID"});

    try {
        await dbConnect();

        const thisProject = await ProjectModel.aggregate([
            { $match: {_id: mongoose.Types.ObjectId(req.query.projectId)} },
            {$project: {"_id": 1, userId: 1, collaborators: 1}},
            {
                $lookup: {
                    from: "posts",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"] }}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "postDates"
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"] }}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetDates"
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        { $match:
                                { $expr:
                                        { $and: [
                                                { $eq: ["$projectId", "$$projectId"] },
                                                { $ne: ["$linkedPosts", []] }
                                            ]}
                                }
                        },
                        { $count: "count" }
                    ],
                    as: "linkedSnippets"
                }
            }
        ]);

        if (!thisProject.length) return res.status(404).json({message: "No project found for given ID"});

        const linkedSnippets = thisProject[0].linkedSnippets;
        const linkedSnippetsCount = linkedSnippets.length ? linkedSnippets[0].count : 0;

        return res.status(200).json({postDates: thisProject[0].postDates, snippetDates: thisProject[0].snippetDates, linkedSnippetsCount: linkedSnippetsCount});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}