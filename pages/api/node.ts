import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NodeModel} from "../../models/node";
import {res400, res403, res404, res200} from "next-response-helpers";
import mongoose from "mongoose";
import {ProjectModel} from "../../models/project";
import {format} from "date-fns";
import short from "short-uuid";
import {NodeTypes} from "../../utils/types";
import {getErrorIfNotExistsAndAuthed, isUserIdMatch} from "../../utils/apiUtils";

const baseBodyFields = ["title"]
const sourceBodyFields = [...baseBodyFields, "link", "notes", "summary", "takeaways"];
const docBodyFields = [...baseBodyFields, "body"];
const getPrivateFields = (type: NodeTypes) => type === "source" ? sourceBodyFields : docBodyFields;
const getPublishedFields = (type: NodeTypes) => [...(type === "source" ? sourceBodyFields : docBodyFields).map(d => `published${d.charAt(0).toUpperCase()}${d.substr(1)}`), "lastPublishedDate"];

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, projectId, type, isOwner: queryIsOwner, page} = req.query;
        const isOwner = queryIsOwner === "true";

        if (id) {
            const thisNode = await NodeModel.findById(id);

            if (!thisNode) return res400(res);

            // fix up these permissions later
            if (!(thisNode.body.publishedTitle || (isOwner && thisUser && thisNode.userId.toString() === thisUser._id.toString()))) return res403(res);

            return res200(res, {node: thisNode});
        }

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);
            if (!thisProject) return res404(res);
            if (isOwner && !isUserIdMatch(thisProject, thisUser)) return res403(res);

            let match = {projectId: mongoose.Types.ObjectId(projectId.toString())};
            if (type) match["type"] = type;
            if (!isOwner) match["body.publishedTitle"] = {$exists: true};

            let shortcutMatch = {userId: thisUser._id};
            if (type) shortcutMatch["type"] = type;

            let sort = {}
            sort[isOwner ? "createdAt" : "body.publishedDate"] = -1;

            const nodes = await NodeModel.aggregate([
                {$match: match},
                {
                    $unionWith: {
                        coll: "nodes",
                        pipeline: [
                            {$match: shortcutMatch},
                            {
                                $lookup: {
                                    from: "shortcuts",
                                    let: {"targetId": "$_id"},
                                    pipeline: [
                                        {
                                            $match: {
                                                $and: [
                                                    {$expr: {$eq: ["$targetId", "$$targetId"]}},
                                                    {$expr: {$eq: ["$projectId", mongoose.Types.ObjectId(projectId.toString())]}},
                                                ],
                                            },
                                        },
                                    ],
                                    as: "shortcutsArr",
                                }
                            },
                            {$match: {shortcutsArr: {$ne: []}}},
                        ],
                    },
                },
                {$sort: sort},
                {$limit: 20},
                {$skip: page ? +page * 20 : 0},
            ]);

            const newNodes = isOwner ? nodes : nodes.map(node => {
                let newNode = {...node.toObject()};
                const fields = getPrivateFields(node.type);
                for (let field of fields) {delete newNode.body[field]};
                return newNode;
            });

            return res200(res, {nodes: newNodes});
        }

        return res400(res);
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id, projectId, type} = req.body;

        // if id as param, then update node
        if (id) {
            const thisNode = (await NodeModel.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(id)}},
                {$lookup: {from: "projects", localField: "projectId", foreignField: "_id", as: "projectArr"}},
            ]))[0];

            if (!thisNode) return res404(res);

            const thisProject = thisNode.projectArr[0];
            const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
            if (projectError) return projectError;

            let newBody = {...thisNode.body};

            const publishedFields = getPublishedFields(thisNode.type);
            const privateFields = getPrivateFields(thisNode.type);

            const isPublish = !!(publishedFields.some(d => req.body[d] !== undefined));

            // if trying to publish and missing urlName or publishedDate, generate them
            if (isPublish) {
                // if missing field, reject request
                if (!publishedFields.every(d => req.body[d] !== undefined)) return res400(res);

                const {lastPublishedDate, publishedTitle} = req.body;

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

            for (let field of [...privateFields, ...publishedFields]) if (req.body[field]) newBody[field] = req.body[field];

            const newNode = await NodeModel.findOneAndUpdate(
                {_id: id},
                {body: newBody},
                {returnOriginal: false},
            );

            return res200(res, {node: newNode});
        }

        // else create new
        const privateFields = type && getPrivateFields(type);

        if (!(projectId && type && privateFields.every(d => req.body[d] !== undefined))) return res400(res);

        const thisNode = await NodeModel.create({
            projectId,
            type,
            body: Object.fromEntries(privateFields.map(d => [d, req.body[d]])),
            userId: thisUser._id,
        });

        return res200(res, {id: thisNode._id});
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        if (!id) return res400(res);

        const thisNode = await NodeModel.findById(id);
        const nodeError = getErrorIfNotExistsAndAuthed(thisNode, thisUser, res);
        if (nodeError) return nodeError;

        await NodeModel.deleteOne({_id: id});

        return res200(res);
    }
});

export default handler;