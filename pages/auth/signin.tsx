import React from "react";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../../components/standard/SignInButton";
import SEO from "../../components/standard/SEO";
import {ssrRedirect} from "next-response-helpers";

export default function SignIn() {
    return (
        <div className="max-w-sm mx-auto px-4">
            <SEO title="Sign in"/>
            <h1 className="up-h1">Sign in</h1>
            <hr className="my-8"/>
            <p className="my-8">If you already have a Postulate account, click below to sign in.</p>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) return ssrRedirect("/projects");

    return {props: {}};
};