import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {getSession} from "next-auth/client";
import {ReactionModel} from "../../models/reaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({message: "Invalid method"});

    let session;
    if (req.method === "POST") {
        session = await getSession({ req });
        if (!session || !session.userId) return res.status(403).json({message: "Not authed"});
        if (!req.body.targetId) return res.status(406).json({message: "Missing target ID"});
    } else {
        if (!req.query.targetId) return res.status(406).json({message: "Missing target ID"});
    }

    try {
        await dbConnect();

        if (req.method === "POST") {
            const conditions = {
                userId: session.userId,
                targetId: req.body.targetId,
            };

            const existingReaction = await ReactionModel.findOne(conditions);

            if (existingReaction) {
                await ReactionModel.deleteOne(conditions);
            } else {
                await ReactionModel.create(conditions);
            }

            return res.status(200).json({message: "Reaction updated"});
        } else {
            const reactions = await ReactionModel.find({
                targetId: req.query.targetId,
            });

            return res.status(200).json({data: reactions});
        }
    } catch (e) {
        return res.status(500).json({message: e});
    }
}