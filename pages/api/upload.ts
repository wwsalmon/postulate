import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import multiparty from "multiparty";
import short from "short-uuid";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ImageModel} from "../../models/image";
import {ImageObj} from "../../utils/types";
import * as fs from "fs";
import dbConnect from "../../utils/dbConnect";
import {res200, res400, res403, res500} from "next-response-helpers";
import {UserModel} from "../../models/user";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res400(res);

    try {
        await dbConnect();

        // check auth
        const session = await getSession({req});
        if (!session) return res403(res);

        const thisUser = await UserModel.findOne({email: session.user.email});

        if (!thisUser) return res403(res);

        const form = new multiparty.Form();

        form.parse(req, async (e, _, files) => {
            const thisFile = files.image[0];

            // if image bigger than 2MB
            if (thisFile.size / 1024 / 1024 > 2) {
                return res500(res, new Error("Maximum allowed filesize is 2MB"));
            }

            const newFilename = short.generate() + "-" + thisFile.originalFilename;
            const fileKey = `${thisUser._id}/${newFilename}`;

            const s3Client = new S3Client({
                region: "us-west-1",
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS,
                    secretAccessKey: process.env.AWS_SECRET,
                }
            });

            const putCommand = new PutObjectCommand({
                Bucket: "postulate",
                Key: fileKey,
                Body: fs.createReadStream(thisFile.path),
            });

            await s3Client.send(putCommand);

            fs.unlink(thisFile.path, () => null);

            const imageObj: ImageObj = {
                key: fileKey,
                userId: thisUser._id,
                size: thisFile.size,
            }

            await ImageModel.create(imageObj);

            return res200(res, {filePath: process.env.CLOUDFRONT_URL + fileKey});
        });
    } catch (e) {
        console.log(e);
        return res500(res, e);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}