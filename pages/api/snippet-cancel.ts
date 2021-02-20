import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {ImageModel} from "../../models/image";
import {deleteImages} from "../../utils/deleteImages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405);
    if (!req.body.urlName) return res.status(406).json({message: "Missing urlName param"});

    const session = await getSession({ req });
    if (!session || !session.userId) return res.status(403);

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        const attachedImages = await ImageModel.find({ attachedUrlName: req.body.urlName });

        const deletedImages = await deleteImages(attachedImages);

        return res.status(200).json({message: `Deleted ${deletedImages ? deletedImages.n : 0} images`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: e});
    }

}