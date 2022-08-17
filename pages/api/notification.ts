import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NotificationModel} from "../../models/notification";
import getLookup from "../../utils/getLookup";
import {res200} from "next-response-helpers";
import mongoose from "mongoose";
import {DatedObj, NodeObjPublic, ProjectObj, UserObj} from "../../utils/types";

export interface NotificationApiResponse {
    userId: string,
    authorId: string,
    nodeId: string,
    itemId: string,
    read: boolean,
    type: string,
    node: DatedObj<NodeObjPublic> & {user: DatedObj<UserObj>, project: DatedObj<ProjectObj>},
    author: DatedObj<UserObj>,
}

const handler: NextApiHandler = nextApiEndpoint({
    async getFunction(req, res, session, thisUser) {
        const notifications = await NotificationModel.aggregate([
            {$match: {userId: mongoose.Types.ObjectId(thisUser._id)}},
            {
                $lookup: {
                    let: {nodeId: "$nodeId"},
                    from: "nodes",
                    pipeline: [
                        {$match: {$expr: {$eq: ["$_id", "$$nodeId"]}}},
                        getLookup("users", "_id", "userId", "user"),
                        {$unwind: "$user"},
                        getLookup("projects", "_id", "projectId", "project"),
                        {$unwind: "$project"},
                    ],
                    as: "node"
                }
            },
            {$unwind: "$node"},
            getLookup("users", "_id", "authorId", "author"),
            {$unwind: "$author"},
            {$sort: {createdAt: 1}},
        ]);

        return res200(res, notifications);
    },
});

export default handler;