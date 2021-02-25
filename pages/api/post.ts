import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {PostObj} from "../../utils/types";
import {PostModel} from "../../models/post";
import {format} from "date-fns";
import short from "short-uuid";
import {UserModel} from "../../models/user";
import {ImageModel} from "../../models/image";
import {deleteImages} from "../../utils/deleteImages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["POST", "DELETE"].includes(req.method)) {
        const session = await getSession({ req });

        if (!session || !session.userId) {
            return res.status(403).json({message: "You must be logged in to make a post."});
        }

        switch (req.method) {
            case "POST":
                // ensure necessary post params are present
                if (!req.body.projectId) return res.status(406).json({message: "No project ID found in request."});
                if (!req.body.tempId) return res.status(406).json({message: "No post urlName found in request."});
                if (!req.body.title) return res.status(406).json({message: "No post title found in request."});
                if (!req.body.body) return res.status(406).json({message: "No post body found in request."});

                try {
                    if (mongoose.connection.readyState !== 1) {
                        await mongoose.connect(process.env.MONGODB_URL, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                        });
                    }

                    const thisProject = await ProjectModel.findOne({ _id: req.body.projectId });
                    if (!thisProject) return res.status(500).json({message: "No project exists for given ID"});
                    if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.map(d => d.toString()).includes(session.userId)) return res.status(403).json({msesage: "You do not have permission to add posts in this project."})

                    if (req.body.postId) {
                        const thisPost = await PostModel.findOne({ _id: req.body.postId });
                        if (!thisPost) return res.status(500).json({message: "No post exists for given ID"});

                        thisPost.title = req.body.title;
                        thisPost.body = req.body.body;
                        thisPost.projectId = req.body.projectId;

                        await thisPost.save();

                        let projectUsername = session.username;

                        // if collaborator, fetch owner username
                        if (thisProject.userId.toString() !== session.userId) {
                            const thisProjectOwner = await UserModel.findOne({ _id: thisProject.userId });
                            projectUsername = thisProjectOwner.username;
                        }

                        const attachedImages = await ImageModel.find({ attachedUrlName: thisPost.urlName });

                        if (attachedImages.length) {
                            const unusedImages = attachedImages.filter(d => !req.body.body.includes(d.key));
                            await deleteImages(unusedImages);
                        }

                        res.status(200).json({
                            message: "Post successfully updated.",
                            url: `/@${projectUsername}/${thisProject.urlName}/${thisPost.urlName}`,
                        });

                        return;
                    } else {
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

                        let projectUsername = session.username;

                        // if collaborator, fetch owner username
                        if (thisProject.userId.toString() !== session.userId) {
                            const thisProjectOwner = await UserModel.findOne({ _id: thisProject.userId });
                            projectUsername = thisProjectOwner.username;
                        }

                        const attachedImages = await ImageModel.find({ attachedUrlName: req.body.tempId });

                        if (attachedImages.length) {
                            const unusedImages = attachedImages.filter(d => !req.body.body.includes(d.key));
                            await deleteImages(unusedImages);

                            const usedImageIds = attachedImages.filter(d => req.body.body.includes(d.key)).map(d => d._id.toString());
                            await ImageModel.updateMany({_id: {$in: usedImageIds}}, {
                                attachedUrlName: urlName,
                            });
                        }

                        res.status(200).json({
                            message: "Post successfully created.",
                            url: `/@${projectUsername}/${thisProject.urlName}/${urlName}`,
                        });

                        return;
                    }
                } catch (e) {
                    return res.status(500).json({message: e});
                }
            case "DELETE":
                if (!req.body.postId) return res.status(406).json({message: "No post ID found in request."});

                try {
                    if (mongoose.connection.readyState !== 1) {
                        await mongoose.connect(process.env.MONGODB_URL, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                        });
                    }

                    await PostModel.deleteOne({ _id: req.body.postId });

                    // `req.body.tempId` is the same as `urlName` when sent from an existing post
                    const attachedImages = await ImageModel.find({attachedUrlName: req.body.tempId});
                    await deleteImages(attachedImages);

                    res.status(200).json({message: "Post successfully deleted."});

                    return;
                } catch (e) {
                    return res.status(500).json({message: e});
                }
        }
    }

    switch (req.method) {
        case "GET":
            if (!req.query.projectId || Array.isArray(req.query.projectId)) return res.status(406).json({message: "No project ID found in request."});

            try {
                if (mongoose.connection.readyState !== 1) {
                    await mongoose.connect(process.env.MONGODB_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                    });
                }

                const queryProjectId: any = req.query.projectId;

                const thisProject = await ProjectModel.findOne({ _id: queryProjectId });
                if (!thisProject) return res.status(500).json({message: "No project exists for given project ID"});

                const thisProjectPosts = await PostModel.find({ projectId: req.query.projectId });

                const authorIds = thisProjectPosts.map(d => d.userId);
                const uniqueAuthorIds = authorIds.filter((d, i, a) => a.findIndex(x => x === d) === i);
                const thisProjectPostAuthors = await UserModel.find({ _id: {$in: uniqueAuthorIds}});

                res.status(200).json({
                    posts: thisProjectPosts,
                    authors: thisProjectPostAuthors,
                });

                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        default:
            return res.status(405);
    }
}