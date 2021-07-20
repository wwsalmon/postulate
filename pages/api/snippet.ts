import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import {SnippetModel} from "../../models/snippet";
import {ProjectModel} from "../../models/project";
import {SnippetObj} from "../../utils/types";
import {ImageModel} from "../../models/image";
import {deleteImages} from "../../utils/deleteImages";
import dbConnect from "../../utils/dbConnect";
import getIsEmpty from "../../utils/slate/getIsEmpty";
import {serialize} from "remark-slate";
import * as mongoose from "mongoose";
import {checkProjectPermission, findImages, findLinks, getCursorStages, snippetGraphStages} from "../../utils/utils";
import {LinkModel} from "../../models/link";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["POST", "DELETE"].includes(req.method)) {
        const session = await getSession({ req });

        if (!session || !session.userId) {
            return res.status(403).json({message: "You must be logged in to edit snippets."});
        }

        try {
            await dbConnect();

            // if batch delete or move
            if (req.body.ids && (req.method === "DELETE" || req.body.projectId)) {
                if (!Array.isArray(req.body.ids) || !req.body.ids.length) return res.status(406).json({message: "No IDs found"});
                const snippets = await SnippetModel.find({_id: {$in: req.body.ids}});
                if (snippets.some(d => d.userId.toString() !== session.userId)) return res.status(403).json({message: "Unauthed"});
                if (req.body.projectId) {
                    const thisProject = await ProjectModel.findById(req.body.projectId);
                    if (!thisProject) return res.status(404).json({message: "Project not found"});
                    if (!checkProjectPermission(thisProject, session.userId)) return res.status(403).json({message: "Unauthed"});
                    await SnippetModel.updateMany({_id: {$in: snippets.map(d => d._id)}}, {
                        $set: {projectId: req.body.projectId},
                    });
                    return res.status(200).json({message: "Snippets successfully moved"});
                } else {
                    await SnippetModel.deleteMany({_id: {$in: snippets.map(d => d._id)}});
                    return res.status(200).json({message: "Snippets successfully deleted"});
                }
            }

            let thisProject: any = null;
            let thisSnippet: any = null; // any typing for mongoose condition type thing

            if (!req.body.projectId && !req.body.id) return res.status(406).json({message: "No project or snippet ID found in request."});

            // if delete or update, we have snippet id. otherwise we have project id
            if (req.body.id) {
                thisSnippet = await SnippetModel.findOne({ _id: req.body.id });

                if (!thisSnippet) return res.status(404).json({message: "No snippet found with given ID."});

                thisProject = await ProjectModel.findOne({ _id: thisSnippet.projectId });

            } else {
                thisProject = await ProjectModel.findOne({ _id: req.body.projectId });
            }

            // check permission
            if ((thisProject.userId.toString() !== session.userId) && !thisProject.collaborators.map(d => d.toString()).includes(session.userId)) return res.status(403).json({msesage: "You do not have permission to save snippets in this project."})

            // if update or create, else delete
            if (req.method === "POST") {
                // moving snippet to a different project, else updating or creating
                if (req.body.id && (req.body.projectId || req.body.privacy)) {
                    if (req.body.projectId) thisSnippet.projectId = req.body.projectId;
                    if (req.body.privacy) thisSnippet.privacy = req.body.privacy;

                    await thisSnippet.save();

                    return res.status(200).json({message: "Snippet successfully updated."});
                }

                // ensure necessary post params are present
                if (!req.body.urlName) return res.status(406).json({message: "No snippet urlName found in request."});
                if (req.body.type === "snippet" && (!req.body.body || (req.body.isSlate && getIsEmpty(req.body.body)))) return res.status(406).json({message: "No snippet body found in request."});
                if (req.body.type === "resource" && !req.body.url) return res.status(406).json({message: "No resource URL found in request."});

                const body = req.body.isSlate ? serialize({
                    type: "div",
                    children: req.body.body,
                }) : req.body.body;

                let linksToAdd = findLinks(req.body.body);

                if (req.body.id) {
                    // find existing links
                    const existingLinks = await LinkModel.find({nodeType: "snippet", nodeId: mongoose.Types.ObjectId(req.body.id), targetType: "url"});
                    // delete links no longer linked in snippet
                    const linksToDelete = existingLinks.filter(d => !linksToAdd.includes(d.targetUrl)).map(d => d._id);
                    if (linksToDelete.length) await LinkModel.deleteMany({_id: {$in: linksToDelete}});
                    // update linksToAdd for new links
                    linksToAdd = linksToAdd.filter(d => !existingLinks.some(x => x.targetUrl === d));
                }

                // delete any images that have been removed
                const attachedImages = await ImageModel.find({attachedUrlName: req.body.urlName});

                if (attachedImages.length) {
                    const usedImages = findImages(req.body.body);
                    const unusedImages = attachedImages.filter(d => !usedImages.some(x => x.includes(d.key)));
                    await deleteImages(unusedImages);
                }

                // create new availableTags in project
                const newTags = req.body.tags.filter(d => !thisProject.availableTags.includes(d));
                if (newTags.length) {
                    thisProject.availableTags = [...thisProject.availableTags, ...newTags];
                    thisProject.markModified("availableTags");
                    await thisProject.save();
                }

                let snippetId = req.body.id || "";

                // if update, else new
                if (req.body.id) {
                    thisSnippet.body = body;
                    if (req.body.isSlate) thisSnippet.slateBody = req.body.body;
                    thisSnippet.url = req.body.url || "";
                    thisSnippet.tags = req.body.tags || [];

                    await thisSnippet.save();
                } else {
                    // assume isSlate always true
                    const newSnippet: SnippetObj = {
                        urlName: req.body.urlName,
                        projectId: req.body.projectId,
                        type: req.body.type,
                        body: body,
                        slateBody: req.body.body,
                        date: new Date().toISOString(),
                        url: req.body.url || "",
                        tags: req.body.tags,
                        userId: session.userId,
                        linkedPosts: [],
                        privacy: "private",
                    }

                    const createdSnippet = await SnippetModel.create(newSnippet);

                    snippetId = createdSnippet._id.toString();
                }

                if (linksToAdd.length) {
                    // @ts-ignore TS wants _id for some reason
                    await LinkModel.insertMany(linksToAdd.map(d => ({
                        nodeType: "snippet",
                        nodeId: snippetId,
                        targetType: "url",
                        targetUrl: d,
                    })));
                }

                res.status(200).json({message: "Snippet successfully saved.", newTags: newTags});

                return;
            } else {
                // get snippet to use urlName
                const thisSnippet = await SnippetModel.findOne({ _id: req.body.id });
                if (!thisSnippet) return res.status(404).json({message: "No snippet found at given ID"});

                // delete any attached images
                const attachedImages = await ImageModel.find({ attachedUrlName: thisSnippet.urlName });

                await deleteImages(attachedImages);

                // delete attached links
                await LinkModel.deleteMany({ nodeId: thisSnippet._id });

                // delete snippet
                await SnippetModel.deleteOne({ _id: req.body.id });

                res.status(200).json({message: "Snippet successfully deleted."});

                return;
            }
        }

         catch (e) {
            return res.status(500).json({message: e});
        }
    } else if (req.method === "GET") {
        if (!req.query.projectId && !req.query.ids && !req.query.userId) return res.status(400).json({message: "Missing params"});
        if (Array.isArray(req.query.search) || Array.isArray(req.query.tags) || Array.isArray(req.query.userIds) || Array.isArray(req.query.ids) || Array.isArray(req.query.projectId) || Array.isArray(req.query.page) || Array.isArray(req.query.userId)) return res.status(400).json({message: "Invalid filtering queries found in request"});

        const session = await getSession({ req });

        try {
            await dbConnect();

            let publicAccess = true;

            if (req.query.projectId && session) {
                const thisProject = await ProjectModel.findById(req.query.projectId);
                if (thisProject && thisProject.userId.toString() === session.userId) publicAccess = false;
            }

            let conditions: any = { projectId: mongoose.Types.ObjectId(req.query.projectId) };
            if (req.query.search) conditions["$text"] = {"$search": req.query.search};
            if (req.query.tags && JSON.parse(req.query.tags).length) conditions["tags"] = {"$in": JSON.parse(req.query.tags)};
            if (req.query.userIds && JSON.parse(req.query.userIds).length) conditions["userId"] = {"$in": JSON.parse(req.query.userIds).map(d => mongoose.Types.ObjectId(d))};
            if (req.query.linked) {
                if (req.query.linked === "true") conditions["linkedPosts"] = {"$exists": true, "$ne": []};
                if (req.query.linked === "false") conditions["linkedPosts"] = {"$eq": []};
            }
            if (req.query.ids && JSON.parse(req.query.ids).length) {
                const ids: any = JSON.parse(req.query.ids).map(d => mongoose.Types.ObjectId(d));
                conditions = { "_id": {"$in": ids}};
            }
            if (req.query.userId) conditions = {"userId": mongoose.Types.ObjectId(req.query.userId), "privacy": "public"};
            if (req.query.projectId && (publicAccess || req.query.public)) conditions["privacy"] = "public";

            const cursorStages = getCursorStages(req.query.page);

            let snippets = await SnippetModel.aggregate([
                {$match: conditions},
                ...snippetGraphStages,
                {$sort: {createdAt: req.query.sort ? +req.query.sort : - 1}},
                ...cursorStages,
            ]);

            const count = await SnippetModel
                .find(conditions)
                .count();

            if (!session || (snippets.length && session.userId !== snippets[0].userId.toString())) {
                snippets = snippets.map(d => (d.privacy === "public") ? d : (() => {
                    let retval = {...d};
                    retval.body = retval.slateBody = retval.tags = retval.linkedPosts = null;
                    return retval;
                })());
            }

            res.status(200).json({snippets: snippets, items: snippets, count: count});

            return;
        } catch (e) {
            return res.status(500).json({message: e});
        }
    } else {
        return res.status(405);
    }
}