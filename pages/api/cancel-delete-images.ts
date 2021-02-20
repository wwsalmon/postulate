import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {ImageModel} from "../../models/image";
import {deleteImages} from "../../utils/deleteImages";
import {PostModel} from "../../models/post";
import {SnippetModel} from "../../models/snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    if (!req.body.urlName && !(req.body.id && req.body.type)) return res.status(406).json({message: "No urlName or id and type found in request"});

    const session = await getSession({ req });
    if (!session || !session.userId) return res.status(403);

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        // if body contains `type`, cancelling edit
        if (req.body.type === "post" || req.body.type === "snippet") {
            if (!req.body.id) return res.status(406).json({message: "No attachment ID found in request"});

            const thisAttachment = await (req.body.type === "post" ? PostModel.findOne({ _id: req.body.id }) : SnippetModel.findOne({ _id: req.body.id }));

            if (!thisAttachment) return res.status(404).json({message: "No post or snippet found at given ID"});

            const attachedImages = await ImageModel.find({ attachedUrlName: thisAttachment.urlName });
            const unusedImages = attachedImages.filter(d => !thisAttachment.body.includes(d.key));
            const deletedImages = await deleteImages(unusedImages);
            return res.status(200).json({message: `Deleted ${deletedImages ? deletedImages.n : 0} images`});
        }

        // if no `type` in body, cancelling new post/snippet
        if (!req.body.urlName) return res.status(406).json({message: "Missing urlName param"});

        const attachedImages = await ImageModel.find({ attachedUrlName: req.body.urlName });

        const deletedImages = await deleteImages(attachedImages);

        return res.status(200).json({message: `Deleted ${deletedImages ? deletedImages.n : 0} images`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e});
    }
}