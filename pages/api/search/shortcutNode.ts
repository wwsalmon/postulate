import {NextApiHandler} from "next";
import {res200, res400, res405, res500} from "next-response-helpers";
import dbConnect from "../../../utils/dbConnect";
import {NodeModel} from "../../../models/node";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "GET") return res405(res);

    const {projectId, query, type} = req.query;

    if (!(projectId && type && query !== undefined)) return res400(res);

    try {
        await dbConnect();

        const nodes = await NodeModel.find({
            projectId: projectId,
            "body.publishedTitle": {$regex: `.*${query}.*`, $options: "i"},
            "body.urlName": {$exists: true},
            type: type,
        }).limit(10);

        return res200(res, {nodes});
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export default handler;