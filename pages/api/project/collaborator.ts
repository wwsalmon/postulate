import {NextApiRequest, NextApiResponse} from "next";
import mongoose from "mongoose";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {getSession} from "next-auth/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["POST", "DELETE"].includes(req.method)) {
        if (!req.body.projectId) return res.status(406).json({message: "No projectId found in request"});

        const session = await getSession({req});

        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });

            const thisProject = await ProjectModel.findOne({ _id: req.body.projectId });

            if (thisProject.userId.toString() !== session.userId) return res.status(403).json({message: "You do not have permission to modify collaborators on this project"})

            if (req.method === "POST") {
                if (!req.body.emails) return res.status(406).json({message: "No emails found in request"});

                const addingUsers = await UserModel.find({ email: {$in: req.body.emails }});

                thisProject.collaborators = [...thisProject.collaborators, ...addingUsers.map(user => user._id.toString())];

                await thisProject.save();

                res.status(200).json({message: "Successfully added collaborators"});
            } else {
                if (!req.body.userId) return res.status(406).json({message: "No userId found in request"});

                thisProject.collaborators = thisProject.collaborators.filter(d => d.toString() !== req.body.userId);

                await thisProject.save();

                res.status(200).json({message: "Successfully deleted collaborator"});
            }

            return;
        } catch (e) {
            return res.status(500).json({message: e});
        }
    }

    switch (req.method) {
        case "GET":
            if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406).json({message: "No projectId found in request"});

            try {
                await mongoose.connect(process.env.MONGODB_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                });

                const queryProjectId: any = req.query.projectId;

                const thisProject = await ProjectModel.findOne({ _id: queryProjectId });

                let thisProjectCollaborators = await UserModel.find({ _id: {$in: thisProject.collaborators }});

                res.status(200).json({collaborators: thisProjectCollaborators});

                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        default:
            return res.status(405);
    }
}