import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NodeModel} from "../../models/node";
import {res400, res403, res404, res200} from "next-response-helpers";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {format} from "date-fns";
import short from "short-uuid";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, projectId, type, isOwner: queryIsOwner} = req.query;
        const isOwner = queryIsOwner === "true";

        if (id) {
            const thisNode = await NodeModel.findById(id);

            // fix up these permissions later
            if (!(thisNode.body.publishedBody || (isOwner && thisUser && thisNode.userId.toString() === thisUser._id.toString()))) return res403(res);

            return res200(res, {node: thisNode});
        }

        if (projectId) {
            if (isOwner) {
                const thisProject = await ProjectModel.findById(projectId);
                if (!(thisProject && thisUser && thisProject.userId.toString() === thisUser._id.toString())) return res403(res);
            }

            let query = {projectId: projectId};
            if (type) query["type"] = type;
            if (!isOwner) query["body.publishedBody"] = {$exists: true};

            const nodes = await NodeModel.find(query);

            const newNodes = isOwner ? nodes : nodes.map(node => {
                let newNode = {...node.toObject()};
                delete newNode.body.title;
                delete newNode.body.body;
                return newNode;
            });

            return res200(res, {nodes: newNodes});
        }

        return res400(res);
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id, projectId, type, body, title, publishedBody, publishedTitle, lastPublishedDate} = req.body;

        // if id as param, then update node
        if (id) {
            const thisNode = (await NodeModel.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(id)}},
                {$lookup: {from: "projects", localField: "projectId", foreignField: "_id", as: "projectArr"}},
            ]))[0];

            if (!thisNode) return res404(res);

            const thisProject = thisNode.projectArr[0];

            if (!thisProject) return res404(res);

            if (thisProject.userId.toString() !== thisUser._id.toString()) return res403(res);

            let newBody = {...thisNode.body};

            const isPublish = !!(publishedTitle || publishedBody || lastPublishedDate);

            // if trying to publish and missing urlName or publishedDate, generate them
            if (isPublish) {
                if (!(publishedTitle && publishedBody && lastPublishedDate)) return res400(res);

                if (!thisNode.body.publishedDate) {
                    newBody["publishedDate"] = lastPublishedDate;
                }

                if (!thisNode.body.urlName) {
                    const urlName: string =
                        format(new Date(), "yyyy-MM-dd") +
                        "-" + encodeURIComponent(publishedTitle.split(" ").slice(0, 5).join("-")) +
                        "-" + short.generate();

                    newBody["urlName"] = urlName;
                }
            }

            if (title) newBody.title = title;
            if (body) newBody.body = body;
            if (publishedBody) newBody.publishedBody = publishedBody;
            if (publishedTitle) newBody.publishedTitle = publishedTitle;
            if (lastPublishedDate) newBody.lastPublishedDate = lastPublishedDate;

            const newNode = await NodeModel.findOneAndUpdate(
                {_id: id},
                {body: newBody},
                {returnOriginal: false},
            );

            return res200(res, {node: newNode});
        }

        // else create new
        if (!(projectId && type && body && title)) return res400(res);

        const thisNode = await NodeModel.create({
            projectId,
            type,
            body: {body, title},
            userId: thisUser._id,
        });

        return res200(res, {id: thisNode._id});
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        if (!id) return res400(res);

        const thisNode = await NodeModel.findById(id);

        if (thisNode.userId.toString() !== thisUser._id.toString()) return res403(res);

        await NodeModel.deleteOne({_id: id});

        return res200(res);
    }
});

export default handler;

const isString = (value: any) => typeof value === "string" || value instanceof String;