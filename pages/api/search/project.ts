import {NextApiHandler} from "next";
import {res200, res400, res404, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {getIncludePrivate} from "../../../utils/apiUtils";
import * as mongoose from "mongoose";
import getLookup from "../../../utils/getLookup";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {userId, query, excludeFeatured: queryExcludeFeatured} = req.query;

    if ((queryExcludeFeatured && !userId) && query) return res400(res);

    try {
        await dbConnect();

        const includePrivate = await getIncludePrivate(req, res, null, userId.toString());

        const pageUser = await UserModel.findById(userId);
        if (!pageUser) return res404(res);

        let matchObj = {};

        if (!includePrivate) matchObj["body.urlName"] = {$exists: true};
        if (userId) matchObj["userId"] = mongoose.Types.ObjectId(userId.toString());
        if (queryExcludeFeatured) matchObj["_id"] = {$not: {$in: pageUser.featuredProjects}};
        matchObj["name"] = {$regex: `.*${query.toString()}.*`, $options: "i"};

        let pipeline: any[] = [
            {$match: matchObj},
            {$limit: 10},
        ];

        if (!userId) pipeline.push(getLookup("users", "_id", "userId", "userArr"));

        const projects = await ProjectModel.aggregate(pipeline);

        return res200(res, {projects});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;