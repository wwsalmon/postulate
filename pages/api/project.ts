import type {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {SnippetModel} from "../../models/snippet";
import {UserModel} from "../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session || !session.userId) {
        return res.status(403).json({message: "You must be logged in to access this endpoint."});
    }

    switch (req.method) {
        case "GET":
            try {
                if (!mongoose.connection) {
                    await mongoose.connect(process.env.MONGODB_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                    });
                }

                if (req.query.shared) {
                    const projects = await ProjectModel.find({ collaborators: session.userId });
                    const projectOwners = projects.map(d => d.userId.toString());
                    const uniqueProjectOwners = projectOwners.filter((d, i, a) => a.findIndex(x => x === d) === i);
                    const owners = await UserModel.find({ _id: {$in: uniqueProjectOwners }});
                    res.status(200).json({projects: projects, owners: owners});
                } else {
                    const projects = await ProjectModel.find({ userId: session.userId });
                    res.status(200).json({projects: projects});
                }

                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        case "DELETE":
            // ensure necessary post params are present
            if (!req.body.id) return res.status(406).json({message: "No project ID found in request."});

            try {
                if (!mongoose.connection) {
                    await mongoose.connect(process.env.MONGODB_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                    });
                }

                const thisProject = await ProjectModel.findOne({ _id: req.body.id });

                if (!thisProject) return res.status(406).json({message: "No project found with given ID."});

                if (thisProject.userId.toString() !== session.userId) return res.status(403).json({msesage: "You do not have permission to delete this snippet."});

                await SnippetModel.deleteMany({ projectId: req.body.id });

                await ProjectModel.deleteOne({ _id: req.body.id });

                res.status(200).json({message: "Project successfully deleted."});
                
                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        default:
            return res.status(405);
    }
}