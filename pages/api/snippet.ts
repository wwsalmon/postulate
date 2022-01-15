import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res400, res403, res404, res200} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import {SnippetModel} from "../../models/snippet";
import {slateInitValue} from "../../utils/utils";
import {DatedObj, UserObj} from "../../utils/types";
import * as mongoose from "mongoose";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);

        const {id, projectId, page} = req.query;

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);

            if (!thisProject) return res404(res);

            if (!isUserIdMatch(thisProject, thisUser)) return res403(res);

            const snippets = await SnippetModel.find({projectId: projectId}).sort({createdAt: -1}).limit(10).skip(10 * +(page || 0));

            return res200(res, {snippets});
        }

        if (id) {
            const thisSnippet = await SnippetModel.findById(id);

            if (!isUserIdMatch(thisSnippet, thisUser)) return res403(res);

            return res200(res, {snippet: thisSnippet});
        }

        return res400(res);
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id, projectId, body} = req.body;

        if (id) {
            const thisSnippet = await SnippetModel.findById(id);

            if (!thisSnippet) return res404(res);

            if (!isUserIdMatch(thisSnippet, thisUser)) return res403(res);

            const newSnippet = await SnippetModel.findOneAndUpdate({_id: id}, {slateBody: body}, {returnOriginal: false});

            return res200(res, {snippet: newSnippet});
        }

        if (projectId && body) {
            const thisProject = await ProjectModel.findById(projectId);

            if (!thisProject) return res404(res);

            if (!isUserIdMatch(thisProject, thisUser)) return res403(res);

            const thisSnippet = await SnippetModel.create({userId: thisUser._id, projectId: projectId, slateBody: slateInitValue});

            return res200(res, {snippet: thisSnippet});
        }

        return res400(res);

    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        if (!id) return res400(res);

        const thisSnippet = await SnippetModel.findById(id);

        if (!thisSnippet) return res404(res);

        if (!isUserIdMatch(thisSnippet, thisUser)) return res403(res);

        await SnippetModel.deleteOne({_id: id});

        return res200(res);
    },
});

const isUserIdMatch = (doc: {userId: mongoose.Types.ObjectId, [key: string]: any}, thisUser: DatedObj<UserObj>) => doc.userId.toString() === thisUser._id.toString();

export default handler;