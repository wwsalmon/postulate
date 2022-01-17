import React from "react";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../../components/standard/SignInButton";
import SEO from "../../components/standard/SEO";
import {ssrRedirect} from "next-response-helpers";
import H1 from "../../components/style/H1";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";

export default function SignIn() {
    return (
        <div className="max-w-sm mx-auto px-4">
            <SEO title="Sign in"/>
            <H1>Sign in</H1>
            <p className="my-8">Click below to sign into Postulate or create a new account.</p>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {props: {}};

    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({email: session.user.email});

        if (!thisUser) return ssrRedirect("/auth/welcome");

        return ssrRedirect("/projects");
    } catch (e) {
        console.log(e);
        return ssrRedirect("/");
    }
};