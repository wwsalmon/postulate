import UpSEO from "../components/up-seo";
import React, {useEffect, useState} from "react";
import {DatedObj, SnippetObjGraph} from "../utils/types";
import axios from "axios";
import UpInlineButton from "../components/style/UpInlineButton";
import ProjectDashboardDropdown from "../components/ProjectDashboardDropdown";
import SnippetModalReadArea from "../components/SnippetModalReadArea";
import {useRouter} from "next/router";
import {FiArrowDown, FiArrowUp, FiChevronsUp, FiExternalLink} from "react-icons/fi";
import {GetServerSideProps} from "next";
import Mousetrap from "mousetrap";
import H1 from "../components/style/H1";
import {format} from "date-fns";

export default function Sniptok() {
    const router = useRouter();
    const [currentSnippet, setCurrentSnippet] = useState<DatedObj<SnippetObjGraph>>(null);
    const [error, setError] = useState<boolean>(false);

    function fetchNewSnippet() {
        axios.get("/api/snippet?random=true").then(res => {
            setCurrentSnippet(res.data.snippet);
            router.push(`/sniptok?id=${res.data.snippet._id}`, null, {shallow: true});
            const oldIdList = localStorage.getItem("sniptokList");
            if (!oldIdList) localStorage.setItem("sniptokList", JSON.stringify([res.data.snippet._id]));
            else {
                const oldIdArr = JSON.parse(oldIdList);
                if (!oldIdArr.length) localStorage.setItem("sniptokList", JSON.stringify([res.data.snippet._id]));
                const lastId = oldIdArr[oldIdArr.length - 1];
                if (lastId !== res.data.snippet._id) {
                    let newIdArr = [...oldIdArr, res.data.snippet._id];
                    if (newIdArr.length > 10) newIdArr.shift();
                    localStorage.setItem("sniptokList", JSON.stringify(newIdArr));
                }
            }
        }).catch(e => {
            console.log(e);
            setError(true);
        });
    }

    function backSnippet() {
        const oldIdList = localStorage.getItem("sniptokList");
        if (!oldIdList) return;
        let oldIdArr = JSON.parse(oldIdList);

        if (!currentSnippet) return;

        let lastId = currentSnippet._id;
        while (lastId === currentSnippet._id) {
            if (!oldIdArr.length) return localStorage.setItem("sniptokList", JSON.stringify(oldIdArr));
            lastId = oldIdArr[oldIdArr.length - 1];
            if (currentSnippet._id === lastId) {
                oldIdArr.pop();
            }
        }

        oldIdArr.pop();
        localStorage.setItem("sniptokList", JSON.stringify(oldIdArr));
        router.push(`/sniptok?id=${lastId}`, null, {shallow: true});
    }

    useEffect(() => {
        if (router.query.id) {
            if (!(currentSnippet && (currentSnippet._id === router.query.id))) {
                axios.get(`/api/snippet?ids=${JSON.stringify([router.query.id])}`).then(res => {
                    setCurrentSnippet(res.data.snippets[0]);
                    const oldIdList = localStorage.getItem("sniptokList");
                    if (!oldIdList) return;
                    let oldIdArr = JSON.parse(oldIdList);
                    if (!oldIdArr.length) return;
                    const lastId = oldIdArr[oldIdArr.length - 1];
                    if (lastId === res.data.snippets[0]._id) return;
                    let newIdArr = [...oldIdArr, res.data.snippets[0]._id];
                    if (newIdArr.length > 10) newIdArr.shift();
                    localStorage.setItem("sniptokList", JSON.stringify(newIdArr));
                }).catch(e => {
                    console.log(e);
                    setError(true);
                });
            }
        } else fetchNewSnippet();
    }, [router.query]);

    useEffect(() => {
        Mousetrap.bind("k", fetchNewSnippet);
        Mousetrap.bind("j", backSnippet);

        return () => Mousetrap.unbind("k", fetchNewSnippet);
        return () => Mousetrap.unbind("j", backSnippet);
    }, [currentSnippet]);

    const thisOwner = currentSnippet && currentSnippet.projectArr[0].ownerArr[0];
    const thisProject = currentSnippet && currentSnippet.projectArr[0];
    const thisAuthor = currentSnippet && currentSnippet.authorArr[0];

    return (
        <>
            <UpSEO title="SnipTok"/>
            <div className="w-full text-white pt-8 -mt-8" style={{
                background: "linear-gradient(60deg, rgba(2,1,31,1) -10%, rgba(5,25,138,1) 26%, rgba(0,212,255,1) 95%)",
                minHeight: "calc(100vh - 66px)"
            }}>
                <div className="fixed flex items-center bottom-4 right-4 shadow backdrop-blur backdrop-filter z-10">
                    <button onClick={backSnippet} className="flex items-center p-4 hover:bg-white hover:bg-opacity-40 rounded-l border hover:border-transparent border-opacity-60">
                        <FiArrowUp/>
                        <span className="ml-2">(J)</span>
                    </button>
                    <button onClick={fetchNewSnippet} className="flex items-center p-4 hover:bg-white hover:bg-opacity-40 rounded-r border hover:border-transparent border-opacity-60">
                        <FiArrowDown/>
                        <span className="ml-2">(K)</span>
                    </button>
                </div>
                <div className="max-w-3xl px-4 mx-auto py-12">
                    <H1 className="mb-12 opacity-25">SnipTok</H1>
                    {error ? (
                        <p>There was an error fetching a new snippet.</p>
                    ) : currentSnippet ? (
                        <>
                            <div className="sm:flex items-center mb-8">
                                <div className="flex items-center">
                                    <UpInlineButton href={`/@${thisAuthor.username}`} className="flex items-center" dark={true}>
                                        <img src={thisAuthor.image} alt={`Profile picture of ${thisAuthor.name}`} className="w-6 h-6 rounded-full"/>
                                        <p className="ml-2">{thisAuthor.name}</p>
                                    </UpInlineButton>
                                    <span className="mx-2">in</span>
                                    <UpInlineButton href={`/@${thisOwner.username}/${thisProject.urlName}`} dark={true}>
                                        <p>{thisProject.name}</p>
                                    </UpInlineButton>
                                </div>
                                <div className="flex ml-auto">
                                    <UpInlineButton
                                        href={`/@${currentSnippet.authorArr[0].username}/s/${currentSnippet._id}`}
                                        className={"ml-auto"}
                                        dark={true}
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-2">Open as page</span>
                                            <FiExternalLink/>
                                        </div>
                                    </UpInlineButton>
                                </div>
                            </div>
                            <SnippetModalReadArea snippet={currentSnippet} dark={true} large={true}/>
                            <p className="text-white text-opacity-50 mt-8">{format(new Date(currentSnippet.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
}