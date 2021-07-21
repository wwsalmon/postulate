import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {NotificationModel} from "../../models/notification";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({message: "Invalid method"});
    if (req.method === "POST") {
        if (!req.body.id) return res.status(406).json({message: "No target ID found"});
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
                            as: "authorArr",
                        }}
                    ],
                    as: "post",
                }},
                {$lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "authorArr",
                }},
            ];

            let notifications = await NotificationModel.aggregate([
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

            const brokenNotifications = notifications.filter(d => !d.comment.length && !d.reaction.length);
            const brokenNotificationIds = brokenNotifications.map(d => d._id.toString());
            if (brokenNotificationIds.length) {
                await NotificationModel.deleteMany({_id: {$in: brokenNotificationIds}});
                notifications = notifications.filter(d => !brokenNotificationIds.includes(d._id.toString()))
            }

            return res.status(200).json({data: notifications});
        } else if (req.method === "POST") {
            const finalPipeline = [
                {$match: {$expr: {$eq: ["$targetId", "$$targetId"]}}},
                {
                    // for each comment, find notifications that the user has for them
                    $lookup: {
                        from: "notifications",
                        let: {"targetId": "$_id"},
                        pipeline: [
                            {$match: {$expr: {$and: [
                                {$eq: ["$targetId", "$$targetId"]},
                                {$eq: ["$userId", mongoose.Types.ObjectId(session.userId)]},
                            ]}}},
                            {$project: {"_id": 1}}
                        ],
                        as: "notifications",
                    }
                },
                {$project: {"notifications": 1}},
            ];

            const secondToLastPipeline = [
                {$match: {$expr: {$eq: ["$_id", "$$targetId"]}}},
                {
                    // all comments with the same targetId as the notification comment
                    $lookup: {
                        from: "comments",
                        let: {"targetId": "$targetId"},
                        pipeline: finalPipeline,
                        as: "comments"
                    }
                },
                {
                    // all reactions with the same targetId as the notification comment
                    $lookup: {
                        from: "reactions",
                        let: {"targetId": "$targetId"},
                        pipeline: finalPipeline,
                        as: "reactions"
                    }
                },
                {$project: {"comments": 1, "reactions": 1, "targetId": 1}}
            ];

            const graphObj = await NotificationModel.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(req.body.id)}},
                {
                    // find comment that this notification refers to, if it's a comment
                    $lookup: {
                        from: "comments",
                        let: {"targetId": "$targetId"},
                        pipeline: secondToLastPipeline,
                        as: "comment",
                    }
                },
                {
                    // find reaction that this notification refers to, if it's a reaction
                    $lookup: {
                        from: "reactions",
                        let: {"targetId": "$targetId"},
                        pipeline: secondToLastPipeline,
                        as: "reaction",
                    }
                },
                {$project: {"type": 1, "comment": 1, "reaction": 1}}
            ]);

            const thisTarget = graphObj[0].type.toLowerCase().includes("comment") ? graphObj[0].comment[0] : graphObj[0].reaction[0];
            const relatedTargets = [...thisTarget.comments, ...thisTarget.reactions];
            const relatedNotificationIds = relatedTargets.reduce((a, b) => [...a, ...b.notifications.map(d => d._id)], []);

            await NotificationModel.updateMany({ _id: {$in: relatedNotificationIds} }, {
                $set: {read: true},
            });

            return res.status(200).json({message: "Marked notifications as read"});
        }
    } catch (e) {
        return res.status(500).json({message: e});
    }
}