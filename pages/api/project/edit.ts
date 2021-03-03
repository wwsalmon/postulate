import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {ProjectModel} from "../../../models/project";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to edit a project."});
    }

    if (!req.body.id) {
        return res.status(406).json({message: "No project ID found in request."});
    }

    if (!req.body.name) {
        return res.status(406).json({message: "No project name found in request."});
    }

    if (!req.body.urlName) {
        return res.status(406).json({message: "No url name found in request."});
    }

    if (req.body.urlName !== encodeURIComponent(req.body.urlName)) {
        return res.status(406).json({message: "Invalid url name"});
    }

    try {
        await dbConnect();

        const thisProject = await ProjectModel.findOne({_id: req.body.id});

        if (!thisProject) return res.status(404).json({message: "No project found for given ID"});

        if (thisProject.userId !== session.userId) return res.status(403).json({message: "Not authorized"});

        thisProject.name = req.body.name;
        thisProject.description = req.body.description || "";
        thisProject.urlName = req.body.urlName;

        await thisProject.save();

        res.status(200).json({message: "Project successfully saved."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}