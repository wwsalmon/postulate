import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {PostObj} from "../../utils/types";
import {PostModel} from "../../models/post";
import {format} from "date-fns";
import short from "short-uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            const session = await getSession({ req });

            if (!session || !session.userId) {
                return res.status(403).json({message: "You must be logged in to make a post."});
            }

            // ensure necessary post params are present
            if (!req.body.projectId) return res.status(406).json({message: "No project ID found in request."});
            if (!req.body.title) return res.status(406).json({message: "No post title found in request."});
            if (!req.body.body) return res.status(406).json({message: "No post body found in request."});

            try {
                await mongoose.connect(process.env.MONGODB_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                });

                const thisProject = await ProjectModel.findOne({ _id: req.body.projectId });
                if (!thisProject) return res.status(500).json({message: "No project exists for given project ID"});

                const urlName: string =
                    format(new Date(), "yyyy-MM-dd") +
                    "-" + encodeURIComponent(req.body.title.split(" ").slice(0, 5).join("-")) +
                    "-" + short.generate();

                const newPost: PostObj = {
                    urlName: urlName,
                    projectId: req.body.projectId,
                    userId: session.userId,
                    title: req.body.title,
                    body: req.body.body,
                }

                await PostModel.create(newPost);

                res.status(200).json({
                    message: "Post successfully created.",
                    url: `/@${session.username}/${thisProject.urlName}/${urlName}`,
                });

                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        default:
            return res.status(405);
    }
}