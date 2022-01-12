import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {NodeModel} from "../../models/node";
import {res400, res403, res404, res200} from "next-response-helpers";
import mongoose from "mongoose";
import {NodeTypes} from "../../utils/types";

const handler: NextApiHandler = nextApiEndpoint(
    async function postFunction(req, res, session, thisUser) {
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

            await NodeModel.updateOne(
                {_id: id},
                {body},
            );

            return res200(res);
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
);

function isBodyValid(body: any, type: NodeTypes): boolean {
    return true;
}