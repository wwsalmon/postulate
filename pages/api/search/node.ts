import {NextApiHandler} from "next";
import {res200, res400, res404, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {getSession} from "next-auth/react";
import {getIncludePrivate, isUserIdMatch} from "../../../utils/apiUtils";
import {NodeModel} from "../../../models/node";
import getLookup from "../../../utils/getLookup";
import * as mongoose from "mongoose";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {projectId, query, userId, type} = req.query;

    if (query === undefined) return res400(res);

    try {
        await dbConnect();

        const includePrivate = await getIncludePrivate(req, res, projectId ? projectId.toString() : null, userId ? userId.toString() : null);

        let matchObj = {};

        if (userId) matchObj["userId"] = mongoose.Types.ObjectId(userId.toString());
        if (projectId) matchObj["projectId"] = mongoose.Types.ObjectId(projectId.toString());

        if (!includePrivate) matchObj["body.urlName"] = {$exists: true};
        matchObj[`body.${includePrivate ? "title" : "publishedTitle"}`] = {$regex: `.*${query}.*`, $options: "i"};
        if (type && ["post", "source", "evergreen"].includes(type.toString())) matchObj["type"] = type.toString();

        let pipeline: any = [
            {$match: matchObj},
            {$limit: 10},
        ];

        if (!userId) pipeline.push(getLookup("users", "_id", "userId", "userArr"));
        if (!projectId) pipeline.push(getLookup("projects", "_id", "projectId", "projectArr"));

        const nodes = await NodeModel.aggregate(pipeline);

        return res200(res, {nodes});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;