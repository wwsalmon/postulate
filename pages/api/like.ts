import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403} from "next-response-helpers";
import mongoose from "mongoose";
import getLookup from "../../utils/getLookup";
import {LikeModel} from "../../models/like";
import checkExistsAndAuthed from "../../utils/checkIfExistsAndAuthed";

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

        await LikeModel.create({
            nodeId: req.body.nodeId,
            userId: thisUser._id,
        });

        return res200(res);
    },
    async deleteFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);
        if (!req.body.id) return res400(res);

        const checkResponse = await checkExistsAndAuthed(req.body.id, res, thisUser, LikeModel);
        if (checkResponse) return checkResponse;

        await LikeModel.deleteOne({_id: req.body.id});

        return res200(res);
    },
    allowUnAuthed: true,
});