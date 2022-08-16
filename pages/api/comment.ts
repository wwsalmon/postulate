import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403} from "next-response-helpers";
import {CommentModel} from "../../models/comment";
import mongoose from "mongoose";
import getLookup from "../../utils/getLookup";
import checkExistsAndAuthed from "../../utils/checkIfExistsAndAuthed";

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
        ]);

        return res200(res, comments);
    },
    async postFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.body || !req.body.nodeId) return res400(res);

        let commentObj = {
            body: req.body.body,
            nodeId: req.body.nodeId,
            userId: thisUser._id,
        };

        if (req.body.parentId) commentObj["parentId"] = req.body.parentId;

        await CommentModel.create(commentObj);

        return res200(res);
    },
    async deleteFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.id) return res400(res);

        const checkResponse = await checkExistsAndAuthed(req.body.id, res, thisUser, CommentModel);
        if (checkResponse) return checkResponse;

        await CommentModel.deleteOne({_id: req.body.id});
        await CommentModel.deleteMany({parentId: req.body.id});

        return res200(res);
    },
    allowUnAuthed: true,
});

export default handler;