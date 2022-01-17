import SEO from "../../components/standard/SEO";
import H1 from "../../components/style/H1";
import {GetServerSideProps} from "next";
import {getSession, useSession} from "next-auth/react";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import React, {useState} from "react";
import {ssrRedirect} from "next-response-helpers";
import UiH3 from "../../components/style/UiH3";
import {Field} from "../new/project";
import UiButton from "../../components/style/UiButton";
import axios from "axios";
import {useRouter} from "next/router";

export default function Welcome() {
    const router = useRouter();

    const {data: session} = useSession();
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [usernameError, setUsernameError] = useState<boolean>(false);

    const isDisabled = !session || !username || usernameError;

    function onSubmit() {
        if (isDisabled) return;

        setIsLoading(true);

        const {name, image, email} = session.user;

        axios.post("/api/user", {
            name, image, email, username
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                setUsernameError(true);
                return;
            }

            router.push(`/@${username}`);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    return (
        <div className="max-w-lg mx-auto px-4">
            <SEO title="Sign in"/>
            <H1>New account</H1>
            <p className="my-8">Welcome to Postulate! Choose a username to get started.</p>
            {session ? (
                <>
                    <div className="flex items-center">
                        <img src={session.user.image} alt={`Profile picture of ${session.user.name}`} className="rounded-full w-10 h-10 mr-4"/>
                        <div>
                            <p className="font-bold">{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <UiH3 className="mt-8 mb-2">Username</UiH3>
                    <div className="flex items-center">
                        <p className="mr-2 text-gray-500">postulate.us/@</p>
                        <Field value={username} setValue={(value: string) => {
                            setUsername(value);
                            setUsernameError(false);
                        }} placeholder="username"/>
                    </div>
                    {usernameError && (
                        <p className="text-red-500 my-2">Someone else already has this username</p>
                    )}
                    <UiButton className="mt-8" onClick={onSubmit} isLoading={isLoading} disabled={isDisabled}>Create account</UiButton>
                </>
            ) : (
                <p className="text-gray-400">Loading...</p>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return ssrRedirect("/auth/welcome");

    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({email: session.user.email});

        if (!thisUser) return {props: {}};

        return ssrRedirect("/projects");
    } catch (e) {
        console.log(e);
        return ssrRedirect("/");
    }
};