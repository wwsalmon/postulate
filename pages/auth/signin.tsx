import React from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../../components/sign-in-button";
import UpSEO from "../../components/up-seo";

export default function SignIn() {
    return (
        <div className="max-w-sm mx-auto px-4">
            <UpSEO title="Sign in | Updately"/>
            <h1 className="up-h1">Welcome to Updately</h1>
            <hr className="my-8"/>
            <p className="my-8">Click the button below to sign in to or sign up for Updately with your Google account.</p>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        context.res.setHeader("location", session.userId ? "/projects" : "/auth/newaccount");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};