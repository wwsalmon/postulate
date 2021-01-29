import React, {useState} from 'react';
import {GetServerSideProps} from "next";
import {getSession, useSession} from "next-auth/client";
import axios from "axios";
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import SpinnerButton from "../../components/spinner-button";

export default function NewAccount() {
    const router = useRouter();
    const [session, loading] = useSession();
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/newaccount", {
            username: username,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                console.log("redirecting...");
                router.push("/projects");
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }

    return (
        <div className="max-w-sm mx-auto px-4">
            <h1 className="up-h1">Welcome to Updately</h1>
            <hr className="my-8"/>
            <p className="up-ui-title">Creating new account as:</p>
            {loading ? (
                <div className="my-4">
                    <Skeleton count={2}/>
                </div>
            ) : (
                <div className="flex items-center my-4">
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="rounded-full h-12 h-12 mr-4"
                    />
                    <div>
                        <p className="up-ui-title">{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                </div>
            )}
            <hr className="my-8"/>
            <p className="up-ui-title">Choose a username</p>
            <p>Your username determines the URL your profile and public posts will be visible at.</p>
            <div className="flex items-center my-4 content">
                <p className="opacity-50">updately.us/@</p>
                <input
                    type="text"
                    className="border-b border-black"
                    value={username}
                    onChange={e => {
                        setUsername(e.target.value);
                        if (e.target.value !== encodeURIComponent(e.target.value)) {
                            setError("URLs cannot contain spaces or special characters.")
                        }
                        setError(null);
                    }}
                />
            </div>
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <hr className="my-8"/>
            <SpinnerButton
                onClick={onSubmit}
                isLoading={isLoading}
                isDisabled={loading || username !== encodeURIComponent(username) || username.length === 0}
            >
                Let's get started!
            </SpinnerButton>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session || session.userId) {
        context.res.setHeader("location", session ? "/projects" : "/auth/signin");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};