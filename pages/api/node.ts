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
import {ShortcutModel} from "../../models/shortcut";
import getLookup from "../../utils/getLookup";
import shortcut from "./shortcut";

const baseBodyFields = ["title"]
const sourceBodyFields = [...baseBodyFields, "sourceInfo", "notes", "summary", "takeaways"];
const docBodyFields = [...baseBodyFields, "body"];
const getPrivateFields = (type: NodeTypes) => type === "source" ? sourceBodyFields : docBodyFields;
const getPublishedFields = (type: NodeTypes) => [...(type === "source" ? sourceBodyFields : docBodyFields).map(d => `published${d.charAt(0).toUpperCase()}${d.substr(1)}`), "lastPublishedDate"];

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, projectId, type, isOwner: queryIsOwner, page, countPerPage: queryCountPerPage} = req.query;
        const isOwner = queryIsOwner === "true";

        if (id) {
            const thisNode = await NodeModel.findById(id);

            if (!thisNode) return res400(res);

            // fix up these permissions later
            if (!("publishedTitle" in thisNode.body || (isOwner && thisUser && thisNode.userId.toString() === thisUser._id.toString()))) return res403(res);

            return res200(res, {node: thisNode});
        }

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);
            if (!thisProject) return res404(res);
            if (isOwner && !isUserIdMatch(thisProject, thisUser)) return res403(res);

            let match = {projectId: mongoose.Types.ObjectId(projectId.toString())};
            if (type) match["type"] = type;
            if (!isOwner) match["body.publishedTitle"] = {$exists: true};

            const countPerPage = queryCountPerPage ? +queryCountPerPage : 20;

            let shortcutNodeMatch = [{$expr: {$eq: ["$_id", "$$targetId"]}}];
            if (type) shortcutNodeMatch.push({$expr: {$eq: ["$type", type.toString()]}});

            const graph = await NodeModel.aggregate([
                {$match: match}, // change to objectid for projectid
                {
                    $unionWith: {
                        coll: "shortcuts",
                        pipeline: [
                            {$match: {projectId: mongoose.Types.ObjectId(projectId.toString())}},
                            {
                                $lookup: {
                                    from: "nodes",
                                    let: {targetId: "$targetId"},
                                    pipeline: [
                                        {$match: {$and: shortcutNodeMatch}},
                                        getLookup("projects", "_id", "projectId", "project"),
                                        {$unwind: "$project"},
                                    ],
                                    as: "node"
                                },
                            },
                            {$match: {node: {$ne: []}}},
                            {$unwind: "$node"},
                            {
                                $addFields: {
                                    "shortcut._id": "$_id",
                                    "shortcut.projectId": "$projectId",
                                    "shortcut.targetId": "$targetId",
                                    "shortcut.userId": "$userId",
                                    "shortcut.urlName": "$urlName",
                                    "shortcut.type": "$type",
                                    "project": "$node.project",
                                    "body": "$node.body",
                                    "projectId": "$node.projectId",
                                    "userId": "$node.userId",
                                    "type": "$node.type",
                                },
                            },
                            {$project: {_id: 0}},
                            {$addFields: {"_id": "$node._id"}},
                        ],
                    },
                },
                {
                    $facet: {
                        count: [{$count: "count"}],
                        sample: [
                            {$sort: {createdAt: -1}},
                            {$skip: page ? (+page * countPerPage) : 0},
                            {$limit: countPerPage},
                        ],
                    }
                },
            ]);

            console.log(graph);

            const newNodes = isOwner ? graph[0].sample : graph[0].sample.map(node => {
                let newNode = {...node};
                const fields = getPrivateFields(node.type);
                for (let field of fields) {
                    delete newNode.body[field];
                }
                return newNode;
            });

            return res200(res, {nodes: newNodes, count: (graph[0] && graph[0].count[0]) ? graph[0].count[0].count : 0});
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
        await ShortcutModel.deleteMany({targetId: id});

        return res200(res);
    }
});

export default handler;