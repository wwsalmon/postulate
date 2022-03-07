import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NodeModel} from "../../models/node";
import getLookup from "../../utils/getLookup";
import {res200} from "next-response-helpers";
import * as mongoose from "mongoose";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async (req, res, session, thisUser) => {
        const {userId, page} = req.query;

        let matchObj = {
            "body.publishedDate": {$exists: true},
        };

        if (userId) matchObj["userId"] = mongoose.Types.ObjectId(userId.toString());

        const activity = await NodeModel.aggregate([
            {$match: matchObj},
            {$sort: {"createdAt": -1}},
            {$skip: page ? +page * 30 : 0},
            {$limit: 30},
            getLookup("users", "_id", "userId", "userArr"),
            getLookup("projects", "_id", "projectId", "projectArr"),
        ]);

        return res200(res, {activity});
    },
});

export default handler;