import React, {useEffect} from 'react';
import {GetServerSideProps} from "next";
import {getSession, signOut, useSession} from "next-auth/client";
import SignInButton from "../../components/sign-in-button";
import UpSEO from "../../components/up-seo";
import UpBanner from "../../components/UpBanner";
import {FiAlertCircle} from "react-icons/fi";
import Link from "next/link";

export default function SignIn({notAllowed}: {notAllowed: boolean}) {
    const [session, loading] = useSession();

    useEffect(() => {
        if (session && notAllowed) signOut();
    }, [loading]);

    return (
        <div className="max-w-sm mx-auto px-4">
            <UpSEO title="Sign in"/>
            <h1 className="up-h1">Sign in</h1>
            <hr className="my-8"/>
            {notAllowed && (
                <UpBanner>
                    <div className="my-2">
                        <div className="mb-2">
                            <FiAlertCircle/>
                        </div>
                        <span>No account found for the given email. <Link href="/#waitlist"><a className="underline">Sign up for the waitlist</a></Link> to get early access</span>
                    </div>
                </UpBanner>
            )}
            <p className="my-8">If you already have a Postulate account, click below to sign in.</p>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session && !session.userId) return {props: {notAllowed: true}};

    if (session && session.userId) {
        context.res.setHeader("location", "/projects");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {notAllowed: false}};
};