import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {NotificationModel} from "../../models/notification";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({message: "Invalid method"});
    if (req.method === "POST") {
        if (!req.body.targetId) return res.status(406).json({message: "No target ID found"});
    }

    const session = await getSession({ req });
    if (!session || !session.userId) return res.status(403).json({message: "unauthed"});

    try {
        await dbConnect();

        if (req.method === "GET") {
            const postPipeline = [
                {$match: {$expr: {$eq: ["$_id", "$$targetId"]}}},
                {$sort: {"createdAt": -1}},
                {$lookup: {
                    from: "posts",
                    let: {"postId": "$targetId"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$_id", "$$postId"]}}},
                        {$lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "author",
                        }}
                    ],
                    as: "post",
                }},
                {$lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "author",
                }},
            ];

            const notifications = await NotificationModel.aggregate([
                {$match: {userId: mongoose.Types.ObjectId(session.userId)}},
                {$lookup: {
                    from: "comments",
                    let: {"targetId": "$targetId"},
                    pipeline: postPipeline,
                    as: "comment",
                }},
                {$lookup: {
                    from: "reactions",
                    let: {"targetId": "$targetId"},
                    pipeline: postPipeline,
                    as: "reaction",
                }},
            ]);

            return res.status(200).json({data: notifications});
        } else if (req.method === "POST") {
            await NotificationModel.updateMany({ targetId: req.body.targetId }, {
                read: {$set: true},
            });

            return res.status(200).json({message: "Marked notifications as read"});
        }
    } catch (e) {
        return res.status(500).json({message: e});
    }
}