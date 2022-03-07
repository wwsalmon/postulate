import mongoose, {Document} from "mongoose";
import {DatedObj, UserObj} from "./types";
import {NextApiRequest, NextApiResponse} from "next";
import {res403, res404} from "next-response-helpers";
import {getSession} from "next-auth/react";
import {UserModel} from "../models/user";
import {ProjectModel} from "../models/project";

export const isUserIdMatch = (doc: {userId: mongoose.Types.ObjectId | string, [key: string]: any}, thisUser: UserObj & Document | DatedObj<UserObj> | null) => thisUser && doc.userId.toString() === thisUser._id.toString();

export const getErrorIfNotExistsAndAuthed = (doc: {userId: mongoose.Types.ObjectId | string, [key: string]: any} | null, thisUser: UserObj & Document | DatedObj<UserObj>, res: NextApiResponse) => {
    if (!doc) return res404(res);

    if (!isUserIdMatch(doc, thisUser)) return res403(res);

    return false;
}

export const getIncludePrivate = async (req: NextApiRequest, res: NextApiResponse, projectId?: string, userId?: string) => {
    const session = await getSession({req});

    const thisUser = session ? (await UserModel.findOne({email: session.user.email})) : null;

    let includePrivate;

    if (projectId) {
        const thisProject = await ProjectModel.findById(projectId);
        if (!thisProject) return res404(res);
        includePrivate = isUserIdMatch(thisProject, thisUser);
    }

    if (userId) {
        const pageUser = await UserModel.findById(userId);
        if (!pageUser) return res404(res);
        includePrivate =  pageUser._id.toString() === thisUser._id.toString();
    }

    return includePrivate;
}