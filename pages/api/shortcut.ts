import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res200, res400, res404, res500} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import {NodeModel} from "../../models/node";
import {ShortcutModel} from "../../models/shortcut";
import {getErrorIfNotExistsAndAuthed} from "../../utils/apiUtils";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, projectId} = req.query;

        if (id) {
            const thisShortcut = await ShortcutModel.findById(id);
            if (!thisShortcut) return res404(res);

            return res200(res, {shortcut: thisShortcut});
        }

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);
            if (!thisProject) return res404(res);

            const shortcuts = await ShortcutModel.find({projectId: projectId.toString()});

            return res200(res, {shortcuts});
        }
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {projectId, targetId} = req.body;

        if (!(projectId && targetId)) return res400(res);

        const thisProject = await ProjectModel.findById(projectId);
        const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
        if (projectError) return projectError;

        const thisNode = await NodeModel.findById(targetId);
        const nodeError = getErrorIfNotExistsAndAuthed(thisNode, thisUser, res);
        if (nodeError) return nodeError;

        if (!("urlName" in thisNode.body)) return res500(res, new Error("Target node is not published"));

        const thisShortcut = await ShortcutModel.create({
            userId: thisUser._id,
            projectId,
            targetId,
            type: thisNode.type,
            urlName: thisNode.body.urlName,
        });

        return res200(res, {shortcut: thisShortcut});
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        if (!id) return res400(res);

        const thisShortcut = await ShortcutModel.findById(id);
        const shortcutError = getErrorIfNotExistsAndAuthed(thisShortcut, thisUser, res);
        if (shortcutError) return shortcutError;

        await ShortcutModel.deleteOne({_id: id});

        return res200(res);
    }
});

export default handler;