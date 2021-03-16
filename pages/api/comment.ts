import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {getSession} from "next-auth/client";
import {CommentModel} from "../../models/comment";
import * as mongoose from "mongoose";
import {PostModel} from "../../models/post";
import {DatedObj, PostObj} from "../../utils/types";
import {NotificationModel} from "../../models/notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "GET" && req.method !== "DELETE") return res.status(405).json({message: "Invalid method"});

    let session;
    if (req.method === "POST") {
        session = await getSession({ req });
        if (!session || !session.userId) return res.status(403).json({message: "Not authed"});
        if (!req.body.targetId && !req.body.id) return res.status(406).json({message: "Missing target or comment ID"});
        if (!req.body.body) return res.status(406).json({message: "Missing comment body"});
    } else if (req.method === "GET") {
        if (!req.query.targetId) return res.status(406).json({message: "Missing target ID"});
    } else if (req.method === "DELETE") {
        if (!req.body.id) return res.status(406).json({message: "Missing comment ID"});
    }

    try {
        await dbConnect();

        if (req.method === "POST") {
            // if has id body param, update existing comment, else create new
            if (req.body.id) {
                const existingComment = await CommentModel.findById(req.body.id);
                if (!existingComment) return res.status(404).json({message: "No comment found"});
                if (existingComment.userId !== session.userId) return res.status(403).json({message: "unauthed"});
                existingComment.body = req.body.body;
                await existingComment.save();
                return res.status(200).json({message: "Comment updated"});
            } else {
                const thisComment = await CommentModel.create({
                    userId: session.userId,
                    targetId: req.body.targetId,
                    parentCommentId: req.body.parentCommentId || null,
                    body: req.body.body,
                });

                const thisPost: DatedObj<PostObj> = await PostModel.findById(req.body.targetId);

                if (thisPost) {
                    if (thisPost.userId.toString() !== session.userId) {
                        await NotificationModel.create({
                            userId: thisPost.userId,
                            targetId: thisComment._id,
                            type: "postComment",
                            read: false,
                        });
                    }

                    if (req.body.parentCommentId) {
                        const relevantComments = await CommentModel.find({
                            $or: [
                                { _id: req.body.parentCommentId },
                                { parentCommentId: req.body.parentCommentId },
                            ]
                        });

                        const uniqueRelevantUserIds = relevantComments
                            .map(d => d.userId.toString())
                            .filter((d, i, a) => i === a.findIndex(x => x === d) && d !== session.userId && d !== thisPost.userId);

                        await NotificationModel.insertMany(uniqueRelevantUserIds.map(userId => ({
                            userId: userId,
                            targetId: thisComment._id,
                            type: "postCommentReply",
                            read: false,
                        })));
                    }
                }

                return res.status(200).json({message: "Comment created"});
            }
        } else if (req.method === "GET") {
            if (Array.isArray(req.query.targetId)) return res.status(406).json({message: "Invalid target ID"});
            const comments = await CommentModel.aggregate([
                {
                    $match: { targetId: mongoose.Types.ObjectId(req.query.targetId) }
                }, {
                    $sort: { createdAt: -1 }
                }, {
                    $lookup: {
                        from: "users",
                        let: {
                            "userId": "$userId",
                        },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] }} },
                            { $project: { name: 1, username: 1, image: 1 } }
                        ],
                        as: "author",
                    }
                },
            ]);

            return res.status(200).json({data: comments});
        } else if (req.method === "DELETE") {
            await CommentModel.deleteOne({ _id: req.body.id });

            return res.status(200).json({message: "Comment deleted"});
        }
    } catch (e) {
        return res.status(500).json({message: e});
    }
}