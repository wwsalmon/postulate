import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import multiparty from "multiparty";
import short from "short-uuid";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req});

    if (!session || !session.userId) return res.status(403).json({message: "You must be logged in to upload images."});

    // parse route params
    if (!(Array.isArray(req.query.params) && req.query.params.length === 2 && ["post", "snippet"].includes(req.query.params[0]))) return res.status(500).json({message: "Invalid route"});

    const isPost: boolean = req.query.params[0] === "post";
    const urlName: string = req.query.params[1];

    const form = new multiparty.Form();

    let fileStream = null;

    form.on("error", e => console.log(e));

    form.on("part", async (part) => {
        if (part.filename) {
            fileStream = part;
        }
        part.resume();
    });

    form.on("close", async () => {
        const chunks = [];
        for await (let chunk of fileStream) {
            chunks.push(chunk);
        }
        const fileData = Buffer.concat(chunks).toString("binary");
        const newFilename = short.generate() + "-" + fileStream.filename;

        const s3Client = new S3Client({region: "us-west-1"});

        const putCommand = new PutObjectCommand({
            Bucket: "postulate",
            Key: `${session.userId}/${newFilename}`,
            Body: fileData,
        });

        try {
            await s3Client.send(putCommand);
            res.status(200).json({data: {filePath: process.env.CLOUDFRONT_URL + `/${session.userId}/${newFilename}`}});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: e});
        }

        return;
    });

    form.parse(req);
}

export const config = {
    api: {
        bodyParser: false,
    },
}