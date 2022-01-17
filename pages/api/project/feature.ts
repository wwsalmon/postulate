import {NextApiHandler} from "next";
import nextApiEndpoint from "../../../utils/nextApiEndpoint";
import {res400, res403, res404, res200} from "next-response-helpers";
import {ProjectModel} from "../../../models/project";
import {UserModel} from "../../../models/user";
import {getErrorIfNotExistsAndAuthed} from "../../../utils/apiUtils";

const handler: NextApiHandler = nextApiEndpoint({
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {id} = req.body;

        const thisProject = await ProjectModel.findById(id);

        const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
        if (projectError) return projectError;

        if (thisUser.featuredProjects.some(d => d.toString() === thisProject._id.toString())) return res200(res, {message: "Already featured"});

        // @ts-ignore todo: find out why it's unhappy and fix
        await UserModel.updateOne({_id: thisUser._id}, {$push: {featuredProjects: thisProject._id}});

        return res200(res);
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        const thisProject = await ProjectModel.findById(id);
        const projectError = getErrorIfNotExistsAndAuthed(thisProject, thisUser, res);
        if (projectError) return projectError;

        if (!thisUser.featuredProjects.some(d => d.toString() === thisProject._id.toString())) return res200(res, {message: "Already not featured"});

        // @ts-ignore todo: find out why it's unhappy and fix
        await UserModel.updateOne({_id: thisUser._id}, {$pull: {featuredProjects: thisProject._id}});

        return res200(res);
    }
});

export default handler;