import {NextApiHandler} from "next";
import {res200, res400, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {NodeModel} from "../../../models/node";
import mongoose from "mongoose";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {projectId, thisProjectId, query, type} = req.query;

    if (!(projectId && thisProjectId && type && query !== undefined)) return res400(res);

    try {
        await dbConnect();

        const nodes = await NodeModel.aggregate([
            {
                $match: {
                    projectId: mongoose.Types.ObjectId(projectId.toString()),
                    "body.publishedTitle": {$regex: `.*${query}.*`, $options: "i"},
                    "body.urlName": {$exists: true},
                    type: type,
                },
            },
            {
                $lookup: {
                    from: "shortcuts",
                    let: {"targetId": "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {$expr: {$eq: ["$targetId", "$$targetId"]}},
                                    {$expr: {$eq: ["$projectId", mongoose.Types.ObjectId(thisProjectId.toString())]}},
                                ],
                            },
                        },
                    ],
                    as: "shortcutsArr",
                }
            },
            {
                $match: {
                    shortcutsArr: [],
                }
            },
        ]).limit(10);

        return res200(res, {nodes});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;