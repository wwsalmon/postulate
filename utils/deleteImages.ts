import {DatedObj, ImageObj} from "./types";
import {DeleteObjectsCommand, S3Client} from "@aws-sdk/client-s3";
import {ImageModel} from "../models/image";

export async function deleteImages(imageArray: DatedObj<ImageObj>[]) {
    let deleteRes = null;

    if (imageArray.length) {
        const s3Client = new S3Client({region: "us-west-1"})

        const deleteCommand = new DeleteObjectsCommand({
            Bucket: "postulate",
            Delete: {
                Objects: imageArray.map(d => ({Key: d.key})),
            }
        });

        await s3Client.send(deleteCommand);

        // delete MongoDB image objects
        deleteRes = await ImageModel.deleteMany({_id: {$in: imageArray.map(d => d._id.toString())}});
    }

    return deleteRes;
}