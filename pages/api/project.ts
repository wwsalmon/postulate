import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res400, res403, res500, res404, res200} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import {UserModel} from "../../models/user";
import {NodeModel} from "../../models/node";
import {ShortcutModel} from "../../models/shortcut";
import * as mongoose from "mongoose";
import getLookup from "../../utils/getLookup";

const handler: NextApiHandler = nextApiEndpoint({
    getFunction: async function getFunction(req, res, session, thisUser) {
        const {id, userId, featured: queryFeatured} = req.query;

        const featured = queryFeatured === "true";

        if (id) {
            const project = await ProjectModel.findById(id);

            if (!project) return res404(res);

            return res200(res, {project});
        }

        if (userId) {
            const thisUser = await UserModel.findById(userId);

            if (!thisUser) return res404(res);

            let projectQuery = {userId: userId};

            if (featured) projectQuery["_id"] = {$in: thisUser.featuredProjects};

            const projects = await ProjectModel.find(projectQuery);

            return res200(res, {projects});
        }

        return res400(res);
    },
    postFunction: async function postFunction(req, res, session, thisUser) {
        const {name, description, urlName, id} = req.body;

        if (!(name && description && urlName)) return res400(res);

        let existingProjectQuery = {userId: thisUser._id, urlName: urlName};

        if (id) existingProjectQuery["_id"] = {$ne: id};

        const existingProject = await ProjectModel.findOne(existingProjectQuery);

        if (existingProject) return res200(res, {error: "urlNameError"});

        const project = id ? (await ProjectModel.findOneAndUpdate({_id: id}, {
            $set: {name, description, urlName},
        }, {returnOriginal: false})) : (await ProjectModel.create({
            userId: thisUser._id,
            name: name,
            description: description,
            urlName: urlName,
        }));

        return res200(res, {project});
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        const {id} = req.body;

        const thisProject = await ProjectModel.findById(id);

        if (!thisProject) return res404(res);

        const shortcutsToDelete = await ProjectModel.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(id)}},
            {
                $lookup: {
                    from: "nodes",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        getLookup("shortcuts", "targetId", "_id", "shortcutsArr"),
                        {$match: {shortcutsArr: {$ne: []}}},
                    ],
                    as: "nodesArr",
                },
            },
            {$unwind: "$nodesArr"},
            {$unwind: "$nodesArr.shortcutsArr"},
            {$project: {_id: "$nodesArr.shortcutsArr._id"}},
        ]);

        const shortcutIdsToDelete = shortcutsToDelete.map(d => d._id);

        await ShortcutModel.deleteMany({$or: [{targetId: {$in: shortcutIdsToDelete}}, {projectId: id}]});

        await NodeModel.deleteMany({projectId: id});

        await ProjectModel.deleteOne({_id: id});

        return res200(res);
    }
});

export default handler;