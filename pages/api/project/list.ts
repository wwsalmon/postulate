import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose, {Document} from "mongoose";
import {ProjectModel} from "../../../models/project";
import {ProjectObj} from "../../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to view your projects."});
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const projects = await ProjectModel.find({ userId: session.userId });

        res.status(200).json({projects: projects});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}