import React, {useState} from 'react';
import {getSession, useSession} from "next-auth/client";
import Skeleton from "react-loading-skeleton";
import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj, UserObj} from "../../utils/types";
import SpinnerButton from "../../components/spinner-button";
import axios from "axios";
import {useRouter} from "next/router";
import Link from "next/link";

export default function EditProfile({thisUser}: { thisUser: DatedObj<UserObj> }) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [username, setUsername] = useState<string>(thisUser.username || "");
    const [bio, setBio] = useState<string>(thisUser.bio || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/account", {
            username: username,
            bio: bio,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                router.push(`/@${thisUser.username}`);
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="up-h1">Edit profile info</h1>
            <hr className="my-8"/>
            <h3 className="up-ui-title">Your account</h3>
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
            <h3 className="up-ui-title">Bio</h3>
            <p>Your bio is displayed on your profile, posts, and projects you own or are a collaborator on.</p>
            <input
                type="text"
                className="w-full content h-12 my-4 px-2 border"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={`Product Manager at Rove`}
            />
            <hr className="my-8"/>
            <p className="up-ui-title">Username</p>
            <p>Your username determines the URL your profile and public posts will be visible at. <i>Warning: changing your username will break all links using your old username.</i></p>
            <div className="flex items-center my-4 content">
                <p className="opacity-50">postulate.us/@</p>
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
            <hr className="my-8"/>
            {error && (
                <p className="text-red-500 mb-8">{error}</p>
            )}
            <div className="flex">
                <SpinnerButton
                    onClick={onSubmit}
                    isLoading={isLoading}
                    isDisabled={loading || username !== encodeURIComponent(username) || username.length === 0}
                >
                    Save
                </SpinnerButton>
                <Link href={`/@${thisUser.username}`}>
                    <a className="up-button text">
                        Cancel
                    </a>
                </Link>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);

    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({ username: username });

        if (!thisUser) return { notFound: true };

        const session = await getSession(context);

        if (thisUser._id.toString() !== session.userId) return { notFound: true };

        return { props: { thisUser: cleanForJSON(thisUser), key: username + "-edit" }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}