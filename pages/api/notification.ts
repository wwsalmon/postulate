import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NotificationModel} from "../../models/notification";
import getLookup from "../../utils/getLookup";
import {res200} from "next-response-helpers";

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
});

export default handler;