import {DatedObj, SnippetObjGraph} from "../utils/types";
import {format} from "date-fns";
import SnippetItemCardReadOnly from "./SnippetItemCardReadOnly";
import PaginationBar from "./PaginationBar";
import Skeleton from "react-loading-skeleton";
import React, {Dispatch, SetStateAction, useState} from "react";
import Link from "next/link";
import {snippetsExplainer} from "../utils/copy";

export default function ProjectSnippetBrowser({snippets, isOwner, snippetPage, setSnippetPage, projectId}: {
    snippets: {snippets: DatedObj<SnippetObjGraph>[], count: number} | undefined,
    isOwner?: boolean,
    snippetPage: number,
    setSnippetPage: Dispatch<SetStateAction<number>>,
    projectId?: string,
}) {
    const snippetsReady = snippets && snippets.snippets;

    return (
        <div className="mb-12">
            <p className="mb-4 up-gray-400">
                {isOwner ? (
                    <span>You are viewing this {projectId ? "project" : "user"}'s snippets as a public visitor. To see all your snippets, go to {
                        projectId ? (
                            <Link href={`/projects/${projectId}`}>
                                <a className="underline">project dashboard</a>
                            </Link>
                        ) : "the dashboards of your projects"
                    }.</span>
                ) : (
                    <span>{snippetsExplainer}</span>
                )}
            </p>
            {snippetsReady ? !!snippets.snippets.length ? (
                <div className="mb-12 -mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {snippets.snippets.map((item, i, a) => (
                            <>
                                {(i === 0 || format(new Date(item.createdAt), "yyyy-MM-dd") !== format(new Date(a[i - 1].createdAt), "yyyy-MM-dd")) && (
                                    <p className="up-ui-title mt-12 pb-4 md:col-span-2 xl:col-span-3">{format(new Date(item.createdAt), "EEEE, MMMM d")}</p>
                                )}
                                <SnippetItemCardReadOnly snippet={item} showProject={!projectId}/>
                            </>
                        ))}
                    </div>
                    <PaginationBar
                        page={snippetPage}
                        count={snippets.count}
                        label="snippet"
                        setPage={setSnippetPage}
                    />
                </div>
            ) : (
                <p>No public snippets have been published {projectId ? "in this project" : "by this user"} yet.</p>
            ) : (
                <Skeleton count={1} className="h-32 w-full mt-12"/>
            )}
        </div>
    );
}