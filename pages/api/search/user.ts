import {NextApiRequest, NextApiResponse} from "next";
import {UserModel} from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.query) return res.status(406).json({message: "No query found in request"});

    try {
        await dbConnect();

        const matchUsers = await UserModel.find({"name": {$regex: `.*${req.query.query}.*`, $options: "i"}}).limit(10);

        res.status(200).json({results: matchUsers});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}