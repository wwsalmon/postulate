import {getSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import {ssr404, ssrRedirect} from "next-response-helpers";
import dbConnect from "../utils/dbConnect";
import {UserModel} from "../models/user";

export default function ProfileRedirect({}: {  }) {
    return (
        <></>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return ssrRedirect("/auth/signin");

    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({email: session.user.email});

        if (!thisUser) return ssrRedirect("/auth/welcome");

        return ssrRedirect(`/@${thisUser.username}`);
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};