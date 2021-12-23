import React from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../../components/standard/SignInButton";
import UpSEO from "../../components/standard/UpSEO";

export default function Welcome() {
    return (
        <div className="max-w-sm mx-auto px-4">
            <UpSEO title="Sign in"/>
            <h1 className="up-h1">Welcome to Postulate</h1>
            <hr className="my-8"/>
            <p className="my-8">Click the button below to sign in to or sign up for Postulate with your Google account.</p>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) return {redirect: {permanent: false, destination: session.userId ? "/projects" : "/auth/newaccount"}};

    return {props: {}};
};