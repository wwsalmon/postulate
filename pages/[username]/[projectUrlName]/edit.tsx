import React, {useState} from 'react';
import {GetServerSideProps} from "next";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON} from "../../../utils/utils";
import {getSession, useSession} from "next-auth/client";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import {useRouter} from "next/router";
import axios from "axios";
import SpinnerButton from "../../../components/spinner-button";
import Link from "next/link";
import dbConnect from "../../../utils/dbConnect";

export default function EditProject({projectData, thisUser}: {projectData: DatedObj<ProjectObj>, thisUser: DatedObj<UserObj>}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [name, setName] = useState<string>(projectData.name);
    const [description, setDescription] = useState<string>(projectData.description || "");
    const [urlName, setUrlName] = useState<string>(projectData.urlName || "");
    const [urlError, setUrlError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/project/edit", {
            id: projectData._id.toString(),
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
            <h1 className="up-h1">Edit project info</h1>
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
                <p>This is the URL your project will be publicly accessible at. Changing the URL name will break any links you shared with the old URL name.</p>
                <div className="flex items-center my-4 content">
                    <span className="opacity-50">postulate.us/@{thisUser.username}/</span>
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
            <div className="flex">
                <SpinnerButton
                    onClick={onSubmit}
                    isLoading={isLoading}
                    isDisabled={!name || !urlName || urlName !== encodeURIComponent(urlName)}
                >
                    Save
                </SpinnerButton>
                <Link href={`/@${thisUser.username}/${projectData.urlName}/`}>
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
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    const session = await getSession(context);

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const thisUser = await UserModel.findOne({ username: username });
        if (!thisUser) return { notFound: true };

        // redirect if not authenticated or authorized
        if (!session || !session.userId || thisUser._id.toString() !== session.userId) {
            return {redirect: {permanent: false, destination: `/@${username}/${projectUrlName}`}};
        }

        const thisProject = await ProjectModel.findOne({ userId: thisUser._id, urlName: projectUrlName });

        return { props: { projectData: cleanForJSON(thisProject), thisUser: cleanForJSON(thisUser), key: projectUrlName }};
    } catch (e) {
        console.log("error");
        console.log(e);
        return { notFound: true };
    }
};