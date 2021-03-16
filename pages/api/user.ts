import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);
    if (!req.query.id || Array.isArray(req.query.id)) return res.status(406).json({message: "No ID found in request"});

    try {
        await dbConnect();
        
        const user = await UserModel.findById(req.query.id);

        if (!user) return res.status(404).json({message: "No user found"});

        return res.status(200).json({data: user});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}