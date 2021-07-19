import React, {useEffect, useState} from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import NavbarQuickSnippetModal from "../components/navbar-quick-snippet-modal";
import {useRouter} from "next/router";
import {FiCheckCircle} from "react-icons/fi";

export default function QuickSnippetPage() {
    const router = useRouter();
    const url = router.query.url;
    const text = router.query.text;
    const isExtension = router.query.isExtension;
    const [saved, setSaved] = useState<boolean>(false);

    let initBody = [];
    if (url) initBody.push({"type":"p","children":[{"type":"a","url":url,"children":[{"text":url}],"id":1}],"id":0});
    if (text) initBody.push({"type":"blockquote","children":[{"text":text}],"id":2})
    initBody.push({"type":"p","children":[{"text": ""}],"id":3});

    useEffect(() => {
        if (saved) {
            console.log("saved");
            setTimeout(() => {
                window.close();
                console.log("2 seconds passed");
            }, 1000);
        }
    }, [saved]);

    return (
        <div className="max-w-4xl mx-auto px-4">
            {saved ? (
                <div className="text-center">
                    <FiCheckCircle className="mx-auto text-2xl mb-4"/>
                    <p className="content">Snippet successfully saved.</p>
                    <p className="up-gray-400">Closing tab...</p>
                </div>
            ) : (
                <>
                    <NavbarQuickSnippetModal
                        setOpen={() => null}
                        /* @ts-ignore */
                        initBody={initBody}
                        startNode={+ +!!url + +!!text}
                        callback={() => isExtension ? setSaved(true) : router.push("/projects")}
                    />
                </>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session || !session.userId) return {redirect: {permanent: false, destination: session ? "/auth/newaccount" : "/auth/signin"}};

    return {props: {}};
};