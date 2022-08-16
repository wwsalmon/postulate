import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NotificationModel} from "../../models/notification";
import getLookup from "../../utils/getLookup";
import {res200, res400} from "next-response-helpers";
import checkExistsAndAuthed from "../../utils/checkIfExistsAndAuthed";

const handler: NextApiHandler = nextApiEndpoint({
    async getFunction(req, res, session, thisUser) {
        const notifications = await NotificationModel.aggregate([
            {$match: {userId: thisUser._id}},
            getLookup("nodes", "_id", "nodeId", "node"),
            {$unwind: "$node"},
            getLookup("users", "_id", "authorId", "author"),
            {$unwind: "$author"},
            getLookup("comments", "_id", "itemId", "comment"),
            {$unwind: "$comment"},
        ]);

        return res200(res, notifications);
    },
    async postFunction(req, res, session, thisUser) {
        if (!req.body.id) return res400(res);
        const checkResponse = checkExistsAndAuthed(req.body.id.toString(), res, thisUser, NotificationModel);
        if (checkResponse) return checkResponse;

        await NotificationModel.updateOne({_id: req.body.id}, {read: true});

        return res200(res);
    },
    async deleteFunction(req, res, session, thisUser) {
        if (!req.body.id) return res400(res);
        const checkResponse = checkExistsAndAuthed(req.body.id.toString(), res, thisUser, NotificationModel);
        if (checkResponse) return checkResponse;

        await NotificationModel.deleteOne({_id: req.body.id});

        return res200(res);
    }
});