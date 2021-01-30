import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import * as mongoose from "mongoose";
import {ProjectModel} from "../../../../models/project";
import {SnippetModel} from "../../../../models/snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to edit snippets."});
    }

    // ensure necessary post params are present
    if (!req.body.id) return res.status(406).json({message: "No snippet ID found in request"});
    if (req.body.type === "snippet" && !req.body.body) return res.status(406).json({message: "No snippet body found in request."});
    if (req.body.type === "resource" && !req.body.url) return res.status(406).json({message: "No resource URL found in request."});

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        let thisSnippet = await SnippetModel.findOne({ _id: req.body.id });

        if (!thisSnippet) return res.status(406).json({message: "No snippet found with given ID"});

        const thisProject = await ProjectModel.findOne({ _id: thisSnippet.projectId });

        if (thisProject.userId.toString() !== session.userId) return res.status(403).json({msesage: "You do not have permission to edit snippets in this project."})

        thisSnippet.body = req.body.body || "";
        thisSnippet.url = req.body.url || "";

        await thisSnippet.save();

        res.status(200).json({message: "Snippet successfully created."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}