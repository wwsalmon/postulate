import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {TagModel} from "../../models/tag";
import {UserModel} from "../../models/user";
import {PostModel} from "../../models/post";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    try {
        await dbConnect();

        // if for user profile, else in general
        if (req.query.userId && !Array.isArray(req.query.userId)) {
            const graphObj = await PostModel.aggregate([
                {"$match": {"userId": mongoose.Types.ObjectId(req.query.userId)}},
                {"$project": {"tags": 1}},
                {"$unwind": "$tags"},
                {"$group": {"_id": "$tags", "count": { "$sum": 1}}},
                {"$sort": {"count": -1}},
            ]);

            return res.status(200).json({data: graphObj});
        } else {
            const conditions: any = req.query.query ? { $text: { $search: req.query.query }} : {};

            const tags = await TagModel.find(conditions).limit(10);

            return res.status(200).json({tags: tags});
        }
    } catch (e) {
        return res.status(500).json({message: e});
    }
}