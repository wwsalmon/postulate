import {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.email) return res.status(406).json({message: "No email query found in request"});

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
        }

        const matchUsers = await UserModel.find({"email": {$regex: `.*${req.query.email}.*`, $options: "i"}});

        res.status(200).json({results: matchUsers});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}