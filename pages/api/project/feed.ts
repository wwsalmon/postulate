import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import {SnippetModel} from "../../../models/snippet";
import {ProjectModel} from "../../../models/project";
import {getCursorStages, postGraphStages, snippetGraphStages} from "../../../utils/utils";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({message: "Invalid method"});
    const session = await getSession({ req });
    if (!session) return res.status(403).json({message: "Unauthed"});
    if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406).json({message: "Missing projectId"});
    if (Array.isArray(req.query.page)) return res.status(406).json({message: "Invalid page"});

    try {
        await dbConnect();

        const project = await ProjectModel.findById(req.query.projectId);
        if (project.userId.toString() !== session.userId) return res.status(403).json({message: "Unauthed"});

        let conditions = [
            {$match: {projectId: mongoose.Types.ObjectId(req.query.projectId)}},
        ];

        const items = await SnippetModel.aggregate([
            ...conditions,
            ...snippetGraphStages,
            {$unionWith: {coll: "posts", pipeline: [
                        ...conditions,
                        ...postGraphStages,
            ]}},
            ...getCursorStages(req.query.page),
        ]);

        const countArr = await SnippetModel.aggregate([
            ...conditions,
            {$count: "snippets"},
            {$unionWith: {coll: "posts", pipeline: [
                ...conditions,
                {$count: "posts"},
            ]}},
        ]);

        const count = countArr[0].snippets + countArr[1].posts;

        return res.status(200).json({items: items, count: count});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}