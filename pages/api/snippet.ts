import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {SnippetModel} from "../../models/snippet";
import {ProjectModel} from "../../models/project";
import {DatedObj, ProjectObj, SnippetObj} from "../../utils/types";
import {format} from "date-fns";
import short from "short-uuid";
import {UserModel} from "../../models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["POST", "DELETE"].includes(req.method)) {
        const session = await getSession({ req });

        if (!session || !session.userId) {
            return res.status(403).json({message: "You must be logged in to edit snippets."});
        }

        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });

            let thisProject: DatedObj<ProjectObj> = null;
            let thisSnippet: any = null; // any typing for mongoose condition type thing

            if (!req.body.projectId && !req.body.id) return res.status(406).json({message: "No project or snippet ID found in request."});

            // if delete or update, we have snippet id. otherwise we have project id
            if (req.body.id) {
                thisSnippet = await SnippetModel.findOne({ _id: req.body.id });

                if (!thisSnippet) return res.status(406).json({message: "No snippet found with given ID."});

                thisProject = await ProjectModel.findOne({ _id: thisSnippet.projectId });

            } else {
                thisProject = await ProjectModel.findOne({ _id: req.body.projectId });
            }

            // check permission
            if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.map(d => d.toString()).includes(session.userId)) return res.status(403).json({msesage: "You do not have permission to save snippets in this project."})

            // if update or create, else delete
            if (req.method === "POST") {
                // if update, else new
                if (req.body.id) {
                    thisSnippet.body = req.body.body || "";
                    thisSnippet.url = req.body.url || "";

                    await thisSnippet.save();

                    res.status(200).json({message: "Snippet successfully created."});

                    return;
                } else {
                    // ensure necessary post params are present
                    if (req.body.type === "snippet" && !req.body.body) return res.status(406).json({message: "No snippet body found in request."});
                    if (req.body.type === "resource" && !req.body.url) return res.status(406).json({message: "No resource URL found in request."});

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
                }
            } else {
                await SnippetModel.deleteOne({ _id: req.body.id });

                res.status(200).json({message: "Snippet successfully deleted."});

                return;
            }
        }

         catch (e) {
            return res.status(500).json({message: e});
        }
    } else if (req.method === "GET") {
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
    } else {
        return res.status(405);
    }
}