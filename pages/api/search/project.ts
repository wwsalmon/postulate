import {NextApiHandler} from "next";
import {res200, res400, res404, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {userId, query, excludeFeatured: queryExcludeFeatured} = req.query;

    const excludeFeatured = queryExcludeFeatured === "true";

    if (!(userId && query)) return res400(res);

    try {
        await dbConnect();

        const pageUser = await UserModel.findById(userId);
        if (!pageUser) return res404(res);

        let projectQuery = {
            userId: userId,
            name: {$regex: `.*${query}.*`, $options: "i"},
        };

        if (excludeFeatured) projectQuery["_id"] = {$not: {$in: pageUser.featuredProjects}};

        const projects = await ProjectModel
            .find(projectQuery)
            .limit(10);

        return res200(res, {projects});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;