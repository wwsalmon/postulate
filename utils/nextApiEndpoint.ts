import {DatedObj, UserObj} from "./types";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import dbConnect from "./dbConnect";
import {UserModel} from "../models/user";
import {res403, res405, res500} from "next-response-helpers";
import {Session} from "next-auth";
import {Document} from "mongoose";

export type MethodFunction = (req: NextApiRequest, res: NextApiResponse, session: Session, thisUser?: UserObj & Document) => any;

export default function nextApiEndpoint({getFunction, postFunction, deleteFunction, allowUnAuthed}: {
                                            getFunction?: MethodFunction,
                                            postFunction?: MethodFunction,
                                            deleteFunction?: MethodFunction,
                                            allowUnAuthed?: boolean,
                                        }): NextApiHandler {
    const handler: NextApiHandler = async (req, res) => {
        const session = await getSession({req});

        if (!(req.method === "GET" || session || allowUnAuthed)) return res403(res);

        try {
            await dbConnect();

            const thisUser = session ? (await UserModel.findOne({email: session.user.email})) : null;
            if (!(req.method === "GET" || thisUser || allowUnAuthed) || (session && !thisUser)) return res403(res);

            switch (req.method) {
                case "GET": {
                    return getFunction ? await getFunction(req, res, session, thisUser) : res405(res);
                }
                case "POST": {
                    return postFunction ? await postFunction(req, res, session, thisUser) : res405(res);
                }
                case "DELETE": {
                    return deleteFunction ? await deleteFunction(req, res, session, thisUser) : res405(res);
                }
                default: {
                    return res405(res);
                }
            }
        } catch (e) {
            console.log(e);

            return res500(res, e);
        }
    }

    return handler;
}