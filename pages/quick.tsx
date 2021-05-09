import React, {useEffect, useState} from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import NavbarQuickSnippetModal from "../components/navbar-quick-snippet-modal";
import {useRouter} from "next/router";
import {FiCheckCircle} from "react-icons/fi";

export default function QuickSnippetPage() {
    const router = useRouter();
    const url = router.query.url;
    const isExtension = router.query.isExtension;
    const [saved, setSaved] = useState<boolean>(false);

    const initBody = url ? (
        [{"type":"p","children":[{"type":"a","url":url,"children":[{"text":url}],"id":1}],"id":0},{"type":"p","children":[{"text": ""}],"id":2}]
    ) : (
        [{"type":"p","children":[{"text": ""}],"id":0}]
    );

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
                        callback={() => isExtension ? setSaved(true) : router.push("/projects")}
                    />
                </>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session || !session.userId) {
        context.res.setHeader("location", session ? "/auth/newaccount" : "/auth/signin");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};