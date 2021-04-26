import React from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import UpSEO from "../components/up-seo";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";

export default function AdminPortal() {
    const {data, error} = useSWR("/api/admin", fetcher);

    function getIsActive(tester: any, days: number) {
        const posts = tester.postsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < days * 24 * 3600 * 1000).length;
        const snippets = tester.snippetsArr.filter(d => (+new Date() - +new Date(d.createdAt)) < days * 24 * 3600 * 1000).length;
        return (posts || snippets);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <UpSEO title="Admin dashboard" noindex={true}/>
            <h1 className="up-h1">Admin dashboard</h1>
            <hr className="my-8"/>
            <p><b>Active in last 24 hours:</b> {data && data.data && data.data.filter(d => getIsActive(d, 1)).length}</p>
            <p><b>Active in last 48 hours:</b> {data && data.data && data.data.filter(d => getIsActive(d, 2)).length}</p>
            <p><b>Active in last week:</b> {data && data.data && data.data.filter(d => getIsActive(d, 7)).length}</p>
            <p><b>Words written: </b> {data && data.wordCount}</p>
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