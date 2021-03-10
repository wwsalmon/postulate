import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {ProjectModel} from "../../models/project";
import {PostObj} from "../../utils/types";
import {PostModel} from "../../models/post";
import {format} from "date-fns";
import short from "short-uuid";
import {UserModel} from "../../models/user";
import {ImageModel} from "../../models/image";
import {deleteImages} from "../../utils/deleteImages";
import {SnippetModel} from "../../models/snippet";
import dbConnect from "../../utils/dbConnect";
import {TagModel} from "../../models/tag";

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
                if (req.body.privacy !== "public" && req.body.privacy !== "private" && req.body.privacy !== "unlisted") return res.status(406).json({message: "Missing or invalid privacy setting"});

                try {
                    await dbConnect();

                    const thisProject = await ProjectModel.findOne({ _id: req.body.projectId });
                    if (!thisProject) return res.status(500).json({message: "No project exists for given ID"});
                    if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.map(d => d.toString()).includes(session.userId)) return res.status(403).json({message: "You do not have permission to add posts in this project."});

                    // create new tags
                    if (req.body.tags && req.body.tags.length) {
                        const existingTags = await TagModel.find({ key: { $in: req.body.tags }});
                        const newTags = req.body.tags.filter(d => !existingTags.some(x => x.key === d));
                        if (newTags.length) await TagModel.insertMany(newTags.map(d => ({key: d})));
                    }

                    if (req.body.postId) {
                        const thisPost = await PostModel.findOne({ _id: req.body.postId });
                        if (!thisPost) return res.status(500).json({message: "No post exists for given ID"});

                        thisPost.title = req.body.title;
                        thisPost.body = req.body.body;
                        thisPost.projectId = req.body.projectId;
                        thisPost.privacy = req.body.privacy;
                        thisPost.tags = req.body.tags;

                        await thisPost.save();

                        // update attachments
                        const attachedImages = await ImageModel.find({ attachedUrlName: thisPost.urlName });

                        if (attachedImages.length) {
                            const unusedImages = attachedImages.filter(d => !req.body.body.includes(d.key));
                            await deleteImages(unusedImages);
                        }

                        // update linked snippets
                        const linkedSnippets = await SnippetModel.find({ linkedPosts: thisPost._id });
                        const unlinkedSnippetIds = linkedSnippets.map(d => d._id.toString()).filter(d => (req.body.selectedSnippetIds && req.body.selectedSnippetIds.length) ? !req.body.selectedSnippetIds.includes(d) : true);
                        const newLinkedSnippetIds = (req.body.selectedSnippetIds && req.body.selectedSnippetIds.length) ? req.body.selectedSnippetIds.filter(d => !linkedSnippets.map(d => d._id.toString()).includes(d)) : [];

                        if (newLinkedSnippetIds.length) {
                            await SnippetModel.updateMany({ _id: { $in: newLinkedSnippetIds } }, {
                                $push: { linkedPosts: thisPost._id }
                            });
                        }

                        if (unlinkedSnippetIds.length) {
                            await SnippetModel.updateMany({ _id: { $in: unlinkedSnippetIds } }, {
                                $pull: { linkedPosts: thisPost._id }
                            });
                        }

                        res.status(200).json({
                            message: "Post successfully updated.",
                            url: `/@${session.username}/p/${thisPost.urlName}`,
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
                            privacy: req.body.privacy,
                            tags: req.body.tags,
                        }

                        const newPostObj = await PostModel.create(newPost);

                        // update attachments
                        const attachedImages = await ImageModel.find({ attachedUrlName: req.body.tempId });

                        if (attachedImages.length) {
                            const unusedImages = attachedImages.filter(d => !req.body.body.includes(d.key));
                            await deleteImages(unusedImages);

                            const usedImageIds = attachedImages.filter(d => req.body.body.includes(d.key)).map(d => d._id.toString());
                            await ImageModel.updateMany({_id: {$in: usedImageIds}}, {
                                attachedUrlName: urlName,
                            });
                        }

                        // update linked snippets
                        if (req.body.selectedSnippetIds && req.body.selectedSnippetIds.length) {
                            await SnippetModel.updateMany({ _id: { $in: req.body.selectedSnippetIds } }, {
                                $push: { linkedPosts: newPostObj._id }
                            });
                        }

                        res.status(200).json({
                            message: "Post successfully created.",
                            url: `/@${session.username}/p/${urlName}`,
                        });

                        return;
                    }
                } catch (e) {
                    return res.status(500).json({message: e});
                }
            case "DELETE":
                if (!req.body.postId) return res.status(406).json({message: "No post ID found in request."});

                try {
                    await dbConnect();

                    await PostModel.deleteOne({ _id: req.body.postId });

                    // `req.body.tempId` is the same as `urlName` when sent from an existing post
                    const attachedImages = await ImageModel.find({attachedUrlName: req.body.tempId});
                    await deleteImages(attachedImages);

                    // update linked snippets
                    await SnippetModel.updateMany({ linkedPosts: req.body.postId }, {
                        $pull: { linkedPosts: req.body.postId }
                    });

                    res.status(200).json({message: "Post successfully deleted."});

                    return;
                } catch (e) {
                    return res.status(500).json({message: e});
                }
        }
    }

    switch (req.method) {
        case "GET":
            if (
                (!req.query.projectId || Array.isArray(req.query.projectId)) &&
                (!req.query.userId || Array.isArray(req.query.userId))
            ){
                return res.status(406).json({message: "No project ID or user ID found in request."});
            }

            try {
                await dbConnect();

                let conditions: any = req.query.projectId ? { projectId: req.query.projectId } : { userId: req.query.userId };

                if (req.query.private) {
                    const session = await getSession({req});
                    if (req.query.userId && req.query.userId !== session.userId) return res.status(403).json({message: "Unauthed"});
                    const reqProjectId: any = req.query.projectId;
                    const project = await ProjectModel.findOne({_id: reqProjectId});
                    if (project.userId.toString() !== session.userId && !project.collaborators.some(d => d.toString() === session.userId)) return res.status(403).json({message: "Unauthed"});
                } else {
                    conditions["privacy"] = "public";
                }

                if (req.query.search) conditions["$text"] = {"$search": req.query.search};
                if (req.query.tag) conditions["tags"] = req.query.tag;

                const cursor = PostModel
                    .find(conditions)
                    .sort({"createdAt": -1});

                const posts = await (req.query.page ?
                    cursor
                        .skip((+req.query.page - 1) * 10)
                        .limit(10) :
                    cursor
                );

                const count = await PostModel
                    .find(conditions)
                    .count();

                // if projectId, fetch posts for project, otherwise fetch posts for user
                if (req.query.projectId) {
                    const authorIds = posts.map(d => d.userId);
                    const uniqueAuthorIds = authorIds.filter((d, i, a) => a.findIndex(x => x === d) === i);
                    const thisProjectPostAuthors = await UserModel.find({ _id: {$in: uniqueAuthorIds}});

                    res.status(200).json({
                        posts: posts,
                        count: count,
                        authors: thisProjectPostAuthors,
                    });
                } else {
                    const projectIds = posts.map(d => d.projectId);
                    const uniqueProjectIds = projectIds.filter((d, i, a) => a.findIndex(x => x === d) === i);
                    const thisUserPostProjects = await ProjectModel.find({ _id: {$in: uniqueProjectIds }});
                    const ownerIds = thisUserPostProjects.map(d => d.userId);
                    const uniqueOwnerIds = ownerIds.filter((d, i, a) => a.findIndex(x => x === d) === i);
                    const thisUserPostProjectOwners = await UserModel.find({ _id: {$in: uniqueOwnerIds}});

                    res.status(200).json({
                        posts: posts,
                        count: count,
                        projects: thisUserPostProjects,
                        owners: thisUserPostProjectOwners,
                    });
                }

                return;
            } catch (e) {
                return res.status(500).json({message: e});
            }
        default:
            return res.status(405);
    }
}