import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../utils/dbConnect";
import {TagModel} from "../../models/tag";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405);

    try {
        await dbConnect();

        const conditions: any = req.query.query ? { $text: { $search: req.query.query }} : {};

        const tags = await TagModel.find(conditions).limit(10);

        return res.status(200).json({tags: tags});
    } catch (e) {
        return res.status(500).json({message: e});
    }
}