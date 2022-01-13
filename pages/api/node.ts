import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NodeModel} from "../../models/node";
import {res400, res403, res404, res200} from "next-response-helpers";
import mongoose from "mongoose";
import {NodeTypes} from "../../utils/types";
import {ProjectModel} from "../../models/project";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, projectId, type, isOwner} = req.query;

        if (id) {
            const thisNode = await NodeModel.findById(id);

            // fix up these permissions later
            if (!(thisNode.body.publicBody || (isOwner && thisNode.userId.toString() === thisUser._id.toString()))) return res403(res);

            return res200(res, {node: thisNode});
        }

        if (projectId) {
            if (isOwner) {
                const thisProject = await ProjectModel.findById(projectId);
                if (!(thisProject && thisProject.userId.toString() === thisUser._id.toString())) return res403(res);
            }

            let query = {projectId: projectId};
            if (type) query["type"] = type;
            if (!isOwner) query["body.publicBody"] = {$exists: true};

            const nodes = await NodeModel.find(query);

            return res200(res, {nodes: nodes});
        }

        return res400(res);
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id, projectId, type, body} = req.body;

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

            if (!isBodyValid(body, thisNode.type)) return res400(res);

            const newNode = await NodeModel.findOneAndUpdate(
                {_id: id},
                {body},
                {returnOriginal: false},
            );

            return res200(res, {node: newNode});
        }

        // else create new
        if (!(projectId && type && body)) return res400(res);

        if (!isBodyValid(body, type)) return res400(res);

        const thisNode = await NodeModel.create({
            projectId,
            type,
            body,
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

function isBodyValid(body: any, type: NodeTypes): boolean {
    return true;
}