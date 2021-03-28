import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "DELETE") return res.status(405);
    if (!req.body.id) return res.status(406).json({message: "No ID found in request."});

    const session = await getSession({req});
    if (!session) return res.status(403).json({message: "Unauthed"});

    try {
        await dbConnect();

        const thisUser = await UserModel.findById(session.userId);

        if (thisUser._id.toString() !== session.userId) return res.status(403).json({message: "Unauthed"});

        await UserModel.updateOne({_id: session.userId}, (req.method === "POST") ? {
            $push: {featuredPosts: req.body.id},
        } : {
            $pull: {featuredPosts: req.body.id},
        });

        return res.status(200).json({message: "Post added to featured posts"});
    } catch(e) {
        return res.status(500).json({message: e});
    }
}
