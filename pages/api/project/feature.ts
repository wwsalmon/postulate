import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import {ProjectModel} from "../../../models/project";
import {UserModel} from "../../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    const session = await getSession({req});

    if (!session || !session.userId) return res.status(403).json({message: "You must be logged in to feature a project."});

    if (!req.body.id) return res.status(406).json({message: "No project ID found in request."});
    if (!req.body.addOrRemove) return res.status(406).json({message: "No action specified in request."});

    try {
        await dbConnect();

        const thisProject = await ProjectModel.findOne({_id: req.body.id});

        if (!thisProject) return res.status(404).json({message: "No project found for given ID"});

        if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.includes(session.userId)) return res.status(403).json({message: "Not authorized"});

        const modificationObj = (req.body.addOrRemove === "remove") ? { $pull: { featuredProjects: thisProject._id }} : { $push: { featuredProjects: thisProject._id }};

        await UserModel.updateOne({ _id: session.userId }, modificationObj);

        res.status(200).json({message: "Project successfully saved."});

        return;
    } catch (e) {
        return res.status(500).json({message: e});
    }
}