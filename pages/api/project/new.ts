import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import * as mongoose from "mongoose";
import {ProjectObj} from "../../../utils/types";
import {ProjectModel} from "../../../models/project";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to create a project."});
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
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
        }

        const sameUrlProject = await ProjectModel.findOne({ userId: session.userId, urlName: req.body.urlName });

        if (sameUrlProject) return res.status(200).json({error: "You already have a project with this urlName"});

        const newProject: ProjectObj = {
            name: req.body.name,
            urlName: req.body.urlName,
            userId: session.userId,
            description: req.body.description || "",
            stars: null,
            collaborators: [],
            availableTags: [],
        }

        const newProjectObj = await ProjectModel.create(newProject);

        res.status(200).json({message: "Project successfully created.", id: newProjectObj._id.toString()});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}