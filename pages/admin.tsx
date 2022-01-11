import React from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SEO from "../components/standard/SEO";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";
import {DatedObj, UserObj} from "../utils/types";

export interface AdminPortalUserObj extends DatedObj<UserObj> {
    postsArr: {_id: string, createdAt: string}[],
    projects: {_id: string, createdAt: string}[],
    snippetsArr: {_id: string, createdAt: string}[],
}

export function getIsActive(tester: AdminPortalUserObj, days: number) {
    const posts = tester.postsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < days * 24 * 3600 * 1000).length;
    const snippets = tester.snippetsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < days * 24 * 3600 * 1000).length;
    return (posts || snippets);
}

export default function AdminPortal() {
    const {data, error}: responseInterface<{data: AdminPortalUserObj[], wordCount: number, wordsPerWeek: number, snippetsPerWeek: number, postsPerWeek: number}, any> = useSWR("/api/admin", fetcher);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEO title="Admin dashboard" noindex={true}/>
            <h1 className="up-h1">Admin dashboard</h1>
            <hr className="my-8"/>
            <p><b>Active in last 24 hours:</b> {data && data.data && data.data.filter(d => getIsActive(d, 1)).length}</p>
            <p><b>Active in last 48 hours:</b> {data && data.data && data.data.filter(d => getIsActive(d, 2)).length}</p>
            <p><b>Active in last week:</b> {data && data.data && data.data.filter(d => getIsActive(d, 7)).length}</p>
            <p><b>Words written: </b> {data && data.wordCount}</p>
            <p><b>Words/week*: </b> {data && data.wordsPerWeek}</p>
            <p><b>Snippets/week*: </b> {data && data.snippetsPerWeek}</p>
            <p><b>Posts/week*: </b> {data && data.postsPerWeek}</p>
            <p className="up-gray-400">* averaged across users who have been active in the last week, excluding Samson</p>
            <hr className="my-8"/>
            <div className="w-full overflow-x-auto">
                <table className="whitespace-nowrap">
                    <thead>
                    <tr>
                        <th/>
                        <th className="text-left">Name</th>
                        <th className="text-left">Joined</th>
                        <th className="px-2">Total (P|S|Pr)</th>
                        <th className="px-2">7 days (P|S)</th>
                        <th className="px-2">48 hours (P|S)</th>
                        <th className="px-2">24 hours (P|S)</th>
                    </tr>
                    </thead>
                    {data && data.data && data.data.map((tester, i) => (
                        <tr>
                            <td className="text-right pr-3 py-3">{i + 1}</td>
                            <td className="pr-4">
                                <div className="flex items-center">
                                    <img src={tester.image} className="w-6 h-6 rounded-full"/>
                                    <Link href={`/@${tester.username}`}><a className="underline pl-3">{tester.name}</a></Link>
                                </div>
                            </td>
                            <td>{formatDistanceToNow(new Date(tester.createdAt))} ago</td>
                            <td className="text-center">{tester.postsArr.length} | {tester.snippetsArr.length} | {tester.projects.length}</td>
                            <td className="text-center">
                                {tester.postsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 7 * 24 * 3600 * 1000).length}
                                <span> | </span>
                                {tester.snippetsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 7 * 24 * 3600 * 1000).length}
                            </td>
                            <td className="text-center">
                                {tester.postsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 2 * 24 * 3600 * 1000).length}
                                <span> | </span>
                                {tester.snippetsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 2 * 24 * 3600 * 1000).length}
                            </td>
                            <td className="text-center">
                                {tester.postsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 24 * 3600 * 1000).length}
                                <span> | </span>
                                {tester.snippetsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < 24 * 3600 * 1000).length}
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session.user.email !== "wwsamson12309@gmail.com") return {notFound: true};
    return {props: {}};
}