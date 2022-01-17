import {NextApiHandler} from "next";
import nextApiEndpoint from "../../utils/nextApiEndpoint";
import {res400, res403, res500, res404, res200} from "next-response-helpers";
import {ProjectModel} from "../../models/project";
import {UserModel} from "../../models/user";

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
        const {name, description, urlName} = req.body;

        if (!(name && description && urlName)) return res400(res);

        const existingProject = await ProjectModel.findOne({userId: thisUser._id, urlName: urlName});

        if (existingProject) return res200(res, {error: "urlNameError"});

        const project = await ProjectModel.create({
            userId: thisUser._id,
            name: name,
            description: description,
            urlName: urlName,
        });

        return res200(res, {project});
    },
    deleteFunction: async function deleteFunction(req, res, session, thisUser) {
        // to implement

        return res200(res);
    }
});

export default handler;