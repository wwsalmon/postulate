import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({req});

    if (!session) {
        return res.status(403).json({message: "You must have an active session to create an account."});
    }

    if (!req.body.id) {
        return res.status(406).json({message: "No ID found in request."});
    }

    try {
        await dbConnect();

        await UserModel.updateOne({_id: session.userId}, {
            $push: {featuredPosts: req.body.id},
        });

        return res.status(200).json({message: "Post added to featured posts"});
    } catch(e) {
        return res.status(500).json({message: e});
    }
}
