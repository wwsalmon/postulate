import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403} from "next-response-helpers";
import mongoose from "mongoose";
import getLookup from "../../utils/getLookup";
import {LikeModel} from "../../models/like";

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
        } else {
            await LikeModel.create({
                nodeId: req.body.nodeId,
                userId: thisUser._id,
            });
        };

        return res200(res);
    },
    allowUnAuthed: true,
});

export default handler;