import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403, res404} from "next-response-helpers";
import mongoose from "mongoose";
import getLookup from "../../utils/getLookup";
import {LikeModel} from "../../models/like";
import {NotificationModel} from "../../models/notification";
import {CommentModel} from "../../models/comment";
import {NodeModel} from "../../models/node";

const handler: NextApiHandler = nextApiEndpoint({
    async getFunction(req, res) {
        if (!req.query.nodeId) return res400(res);

        const likes = await LikeModel.aggregate([
            {$match: {nodeId: mongoose.Types.ObjectId(req.query.nodeId.toString())}},
            getLookup("users", "_id", "userId", "user"),
            {$unwind: "$user"},
        ]);

        return res200(res, likes);
    },
    async postFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.nodeId) return res400(res);

        const thisLike = await LikeModel.findOne({userId: thisUser._id, nodeId: req.body.nodeId.toString()});

        if (thisLike) {
            await LikeModel.deleteOne({_id: thisLike._id});

            // delete all notifs related to this like
            await NotificationModel.deleteMany({itemId: thisLike._id});
        } else {
            const isComment = req.body.isComment; // comment or post?
            const thisModel = isComment ? CommentModel : NodeModel;
            const thisNode = thisModel.findById(req.body.nodeId);

            if (!thisNode) return res404(res);

            await LikeModel.create({
                nodeId: req.body.nodeId,
                userId: thisUser._id,
            });

            if (isComment) {

            } else {

            }

            await NotificationModel.create({
            });
        };

        return res200(res);
    },
    allowUnAuthed: true,
});

export default handler;