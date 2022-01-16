import mongoose from "mongoose";
import {DatedObj, UserObj} from "./types";
import {NextApiResponse} from "next";
import {res403, res404} from "next-response-helpers";

export const isUserIdMatch = (doc: {userId: mongoose.Types.ObjectId, [key: string]: any}, thisUser: DatedObj<UserObj> | null) => thisUser && doc.userId.toString() === thisUser._id.toString();

export const getErrorIfNotExistsAndAuthed = (doc: {userId: mongoose.Types.ObjectId, [key: string]: any} | null, thisUser: DatedObj<UserObj>, res: NextApiResponse) => {
    if (!doc) return res404(res);

    if (!isUserIdMatch(doc, thisUser)) return res403(res);

    return false;
}