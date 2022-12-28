import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403, res404} from "next-response-helpers";
import {CommentModel} from "../../models/comment";
import mongoose from "mongoose";
import getLookup from "../../utils/getLookup";
import checkExistsAndAuthed from "../../utils/checkIfExistsAndAuthed";
import {NodeModel} from "../../models/node";
import {NotificationModel} from "../../models/notification";
import {LikeModel} from "../../models/like";

const handler: NextApiHandler = nextApiEndpoint({
    async getFunction(req, res) {
        if (!req.query.nodeId) return res400(res);

        const baseStages = [
            getLookup("users", "_id", "userId", "user"),
            {$unwind: "$user"},
        ]

        const comments = await CommentModel.aggregate([
            {$match: {nodeId: mongoose.Types.ObjectId(req.query.nodeId.toString())}},
            {$match: {parentId: {$exists: false}}},
            {
                $lookup: {
                    let: {parentId: "$_id"},
                    from: "comments",
                    pipeline: [
                        {$match: {$expr: {$eq: ["$parentId", "$$parentId"]}}},
                        ...baseStages,
                    ],
                    as: "subComments",
                }
            },
            ...baseStages,
            {$sort: {createdAt: -1}},
        ]);

        return res200(res, comments);
    },
    async postFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.body || !req.body.nodeId) return res400(res);
        const thisNode = await NodeModel.findById(req.body.nodeId);
        if (!thisNode) return res404(res);

        let commentObj = {
            body: req.body.body,
            nodeId: req.body.nodeId,
            userId: thisUser._id,
        };

        let thisParentComment = null;

        if (req.body.parentId) {
            commentObj["parentId"] = req.body.parentId;
            const parentCommentPipeline = await CommentModel.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(req.body.parentId)}},
                getLookup("comments", "parentId", "_id", "subComments"),
            ]);
            thisParentComment = parentCommentPipeline[0];
            if (!thisParentComment) return res404(res);
        }

        const thisComment = await CommentModel.create(commentObj);

        let allUserIds = [];

        if (thisParentComment) {
            const subCommentIds = thisParentComment.subComments.map(d => d.userId);
            const filteredUserIds = [thisParentComment.userId, ...subCommentIds].filter(d => d.toString() !== thisUser._id.toString());
            allUserIds = Array.from(new Set(filteredUserIds));

            const notifications = allUserIds.map(d => ({
                userId: d,
                authorId: thisUser._id,
                nodeId: thisNode._id,
                itemId: thisComment._id,
                read: false,
                type: "commentComment",
            }));

            await NotificationModel.insertMany(notifications);
        }

        if (thisNode.userId.toString() !== thisUser._id.toString() && !allUserIds.some(d => d.toString() === thisNode.userId.toString())) {
            await NotificationModel.create({
                userId: thisNode.userId,
                authorId: thisUser._id,
                nodeId: thisNode._id,
                itemId: thisComment._id,
                read: false,
                type: "nodeComment",
            });
        }

        return res200(res);
    },
    async deleteFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.id) return res400(res);

        const checkResponse = await checkExistsAndAuthed(req.body.id, res, thisUser, CommentModel);
        if (checkResponse) return checkResponse;

        await CommentModel.deleteOne({_id: req.body.id});
        await CommentModel.deleteMany({parentId: req.body.id});
        // todo: delete notifications for subcomments
        // todo: delete likes on subcomments
        // todo: delete notifications for likes on subcomments
        await NotificationModel.deleteMany({itemId: req.body.id});
        await LikeModel.deleteMany({nodeId: req.body.id});
        // todo: delete notifications for likes

        return res200(res);
    },
    allowUnAuthed: true,
});

export default handler;