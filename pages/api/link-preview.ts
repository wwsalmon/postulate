import {NextApiRequest, NextApiResponse} from "next";
import {getLinkPreview} from "link-preview-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.url || Array.isArray(req.query.url)) return res.status(406).json({message: "No URL found in query"});

    try {
        const linkPreview = await getLinkPreview(req.query.url);
        return res.status(200).json(linkPreview);
    } catch (e) {
        return res.status(500).json({message: e});
    }
}