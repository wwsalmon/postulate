import {getSession} from "next-auth/react";
import {UserModel} from "../models/user";
import {GetServerSidePropsContext} from "next";

export default async function getThisUser(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    const thisUser = session ? await UserModel.findOne({email: session.user.email}) : null;

    return thisUser;
}