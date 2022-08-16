import {NextApiResponse} from "next";
import {UserObj} from "./types";
import mongoose, {Document} from "mongoose";
import {res403, res404} from "next-response-helpers";

export default async function checkExistsAndAuthed(id: string, res: NextApiResponse, thisUser: UserObj & Document, model: mongoose.Model<any>) {
    const thisObj = await model.findById(mongoose.Types.ObjectId(id));

    if (!thisObj) return res404(res);

    if (thisObj.userId.toString() !== thisUser._id.toString()) return res403(res);

    return false;
}