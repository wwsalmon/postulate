import {getSession} from "next-auth/react";
import {UserModel} from "../models/user";
import {GetServerSidePropsContext} from "next";
import dbConnect from "./dbConnect";

export default async function getThisUser(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    let thisUser = null;

    if (session) {
        await dbConnect();
        thisUser = await UserModel.findOne({email: session.user.email});
    }

    return thisUser;
}