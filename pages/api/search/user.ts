import {NextApiRequest, NextApiResponse} from "next";
import {UserModel} from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.email && !req.query.query) return res.status(406).json({message: "No email or query found in request"});

    if (Array.isArray(req.query.query)) return res.status(406).json({message: "Invalid query"});

    try {
        await dbConnect();

        const matchUsers = await UserModel.find(req.query.email ? {"email": {$regex: `.*${req.query.email}.*`, $options: "i"}} : {$text: {$search: req.query.query}});

        res.status(200).json({results: matchUsers});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}