import type {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {SnippetModel} from "../../../../models/snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    if (!req.query.projectId) return res.status(406).json({message: "No project ID found in request"});

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const snippets = await SnippetModel.find({ projectId: req.query.projectId });

        res.status(200).json({snippets: snippets});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}