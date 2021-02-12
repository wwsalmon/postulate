import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import * as mongoose from "mongoose";
import {SnippetObj} from "../../../../utils/types";
import {ProjectModel} from "../../../../models/project";
import short from "short-uuid";
import {format} from "date-fns";
import {SnippetModel} from "../../../../models/snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to save snippets."});
    }

    // ensure necessary post params are present
    if (!req.body.projectId) return res.status(406).json({message: "No project ID found in request."});
    if (!req.body.type) return res.status(406).json({message: "No snippet type found in request."});
    if (req.body.type === "snippet" && !req.body.body) return res.status(406).json({message: "No snippet body found in request."});
    if (req.body.type === "resource" && !req.body.url) return res.status(406).json({message: "No resource URL found in request."});

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const thisProject = await ProjectModel.findOne({ _id: req.body.projectId });

        if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.map(d => d.toString()).includes(session.userId)) return res.status(403).json({msesage: "You do not have permission to save snippets in this project."})

        const newSnippet: SnippetObj = {
            urlName: format(new Date(), "yyyy-MM-dd-") + short.generate(),
            projectId: req.body.projectId,
            type: req.body.type,
            body: req.body.body || "",
            date: new Date().toISOString(),
            url: req.body.url || "",
            tags: null,
            likes: null,
            userId: session.userId,
        }

        await SnippetModel.create(newSnippet);

        res.status(200).json({message: "Snippet successfully created."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}