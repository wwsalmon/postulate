import {NextApiHandler} from "next";
import {res200, res400, res404, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {getSession} from "next-auth/react";
import {isUserIdMatch} from "../../../utils/apiUtils";
import {NodeModel} from "../../../models/node";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {projectId, query, userId, type} = req.query;

    if (!((userId || projectId) && query !== undefined)) return res400(res);

    try {
        await dbConnect();

        const session = await getSession({req});

        const thisUser = session ? (await UserModel.findOne({email: session.user.email})) : null;

        let includePrivate;

        if (projectId) {
            const thisProject = await ProjectModel.findById(projectId);
            if (!thisProject) return res404(res);
            includePrivate = isUserIdMatch(thisProject, thisUser);
        }

        if (userId) {
            const pageUser = await UserModel.findById(userId);
            if (!pageUser) return res404(res);
            includePrivate =  pageUser._id.toString() === thisUser._id.toString();
        }

        let mongoQuery = {};
        mongoQuery[projectId ? "projectId" : "userId"] = projectId || userId;
        if (!includePrivate) mongoQuery["body.urlName"] = {$exists: true};
        mongoQuery[`body.${includePrivate ? "title" : "publishedTitle"}`] = {$regex: `.*${query}.*`, $options: "i"};
        if (type && ["post", "source", "evergreen"].includes(type.toString())) mongoQuery["type"] = type.toString();

        console.log(mongoQuery);

        const nodes = await NodeModel.find(mongoQuery).limit(10);

        return res200(res, {nodes});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;