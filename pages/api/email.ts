import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {EmailModel} from "../../models/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.targetId) return res.status(406).json({message: "Missing target ID"});

    try {
        await dbConnect();

        const thisEmail = await EmailModel.findOne({targetId: req.query.targetId});

        return res.status(200).json({email: thisEmail});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}