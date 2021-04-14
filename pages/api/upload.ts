import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import multiparty from "multiparty";
import short from "short-uuid";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ImageModel} from "../../models/image";
import {ImageObj} from "../../utils/types";
import * as fs from "fs";
import dbConnect from "../../utils/dbConnect";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    // check auth
    const session = await getSession({req});
    if (!session || !session.userId) return res.status(403).json({message: "You must be logged in to upload images."});

    // check query params
    if (Array.isArray(req.query.attachedUrlName) || !req.query.attachedUrlName) return res.status(406).json({message: "Missing attachedUrlName query param"});
    if (Array.isArray(req.query.projectId) || !req.query.projectId) return res.status(406).json({message: "Missing projectId query param"});
    if (Array.isArray(req.query.attachedType) || (req.query.attachedType !== "snippet" && req.query.attachedType !== "post")) return res.status(406).json({message: "Missing attachedType query param"});

    const attachedType = req.query.attachedType;
    const attachedUrlName = req.query.attachedUrlName;
    const projectId = req.query.projectId;

    const form = new multiparty.Form();

    form.parse(req, async (e, _, files) => {
        const thisFile = files.image[0];
        const newFilename = short.generate() + "-" + thisFile.originalFilename;
        const fileKey = `${session.userId}/${projectId}/${newFilename}`;

        const s3Client = new S3Client({region: "us-west-1", credentials: {
            accessKeyId: process.env.AWS_ACCESS,
            secretAccessKey: process.env.AWS_SECRET,
        }});

        const putCommand = new PutObjectCommand({
            Bucket: "postulate",
            Key: fileKey,
            Body: fs.createReadStream(thisFile.path),
        });

        try {
            await s3Client.send(putCommand);

            fs.unlink(thisFile.path, () => null);

            await dbConnect();

            const imageObj: ImageObj = {
                key: fileKey,
                userId: session.userId,
                projectId: projectId,
                attachedUrlName: attachedUrlName,
                attachedType: attachedType,
                size: thisFile.size,
            }

            await ImageModel.create(imageObj);

            return res.status(200).json({data: {filePath: process.env.CLOUDFRONT_URL + fileKey}});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e});
        }
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
}