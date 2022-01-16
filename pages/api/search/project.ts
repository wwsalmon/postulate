import {NextApiHandler} from "next";
import {res200, res400, res404, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {userId, query} = req.query;

    if (!(userId && query)) return res400(res);

    try {
        await dbConnect();

        const thisUser = await UserModel.findById(userId);
        if (!thisUser) return res404(res);

        const projects = await ProjectModel
            .find({
                userId: userId,
                name: {$regex: `.*${query}.*`, $options: "i"},
            })
            .limit(10);

        return res200(res, {projects});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;