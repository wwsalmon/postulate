import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res403} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import {SnippetModel} from "../../models/snippet";
import {slateInitValue} from "../../utils/utils";
import {getErrorIfNotExistsAndAuthed, isUserIdMatch} from "../../utils/apiUtils";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        if (!thisUser) return res403(res);

        const {id, projectId, page} = req.query;

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);
            const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
            if (projectError) return projectError;

            const snippets = await SnippetModel.find({projectId: projectId.toString()}).sort({createdAt: -1}).limit(10).skip(10 * +(page || 0));

            const count = await SnippetModel.find({projectId: projectId.toString()}).countDocuments();

            return res200(res, {snippets, count});
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
            const snippetError = getErrorIfNotExistsAndAuthed(thisSnippet, thisUser, res);
            if (snippetError) return snippetError;

            const newSnippet = await SnippetModel.findOneAndUpdate({_id: id}, {slateBody: body}, {returnOriginal: false});

            return res200(res, {snippet: newSnippet});
        }

        if (projectId && body) {
            const thisProject = await ProjectModel.findById(projectId);
            const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
            if (projectError) return projectError;

            const thisSnippet = await SnippetModel.create({userId: thisUser._id, projectId: projectId, slateBody: slateInitValue});

            return res200(res, {snippet: thisSnippet});
        }

        return res400(res);

    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        if (!id) return res400(res);

        const thisSnippet = await SnippetModel.findById(id);
        const snippetError = getErrorIfNotExistsAndAuthed(thisSnippet, thisUser, res);
        if (snippetError) return snippetError;

        await SnippetModel.deleteOne({_id: id});

        return res200(res);
    },
});

export default handler;