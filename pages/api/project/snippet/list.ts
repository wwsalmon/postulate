import type {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {SnippetModel} from "../../../../models/snippet";
import {UserModel} from "../../../../models/user";

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

        const authorIds = snippets.map(d => d.userId);
        const uniqueAuthorIds = authorIds.filter((d, i, a) => a.findIndex(x => x === d) === i);
        const authors = await UserModel.find({ _id: {$in: uniqueAuthorIds }});

        res.status(200).json({snippets: snippets, authors: authors});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}