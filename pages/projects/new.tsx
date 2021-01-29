import React, {useState} from 'react';
import Link from "next/link";
import {FiArrowLeft} from "react-icons/fi";
import {useSession} from "next-auth/client";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import {useRouter} from "next/router";
import BackToProjects from "../../components/back-to-projects";
import SpinnerButton from "../../components/spinner-button";

export default function NewProject() {
    const router = useRouter();
    const [session, loading] = useSession();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [urlError, setUrlError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/project/new", {
            name: name,
            description: description,
            urlName: urlName,
        }).then(res => {
            if (res.data.error) {
                setIsLoading(false);
                console.log(res.data.error);
            } else {
                router.push(`/@${session.username}/${urlName}`);
            }
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <BackToProjects/>
            <hr className="my-8"/>
            <h1 className="up-h1">New project</h1>
            <div className="my-12">
                <h3 className="up-ui-title">Name</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Banana collecting adventures"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="my-12">
                <h3 className="up-ui-title">Description</h3>
                <input
                    type="text"
                    className="border-b w-full content my-2 py-2"
                    placeholder="Notes from my daily trips out into the jungle to collect bananas"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <div className="my-12">
                <h3 className="up-ui-title">URL name</h3>
                <p>This is the URL your project will be publicly accessible at.</p>
                <div className="flex items-center my-4 content">
                    <span className="opacity-50">updately.us/@</span>
                    {session ? (
                        <span className="opacity-50">{session.username}</span>
                    ) : (
                        <Skeleton width={64}/>
                    )}
                    <span className="opacity-50">/</span>
                    <input
                        type="text"
                        className="border-b p-2"
                        value={urlName}
                        onChange={e => {
                            setUrlName(e.target.value);
                            setUrlError(e.target.value !== encodeURIComponent(e.target.value));
                        }}
                    />
                </div>
                {urlError && (
                    <p className="text-red-500">URLs cannot contain spaces or special characters.</p>
                )}
            </div>
            <SpinnerButton
                onClick={onSubmit}
                isLoading={isLoading}
                isDisabled={!name || !urlName || urlName !== encodeURIComponent(urlName)}
            >
                Create
            </SpinnerButton>
        </div>
    );
}