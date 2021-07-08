import React, {ReactNode, useState} from "react";
import ActivityGrid, {ActivityDay} from "./ActivityGrid";
import {format} from "date-fns";
import ActivityGraph from "./ActivityGraph";
import {FiEdit, FiMessageSquare} from "react-icons/fi";
import Tabs from "./Tabs";
import {TabInfo} from "../utils/types";

export function makeGridArr(arr: {createdAt: string}[]) {
    let gridArr: ActivityDay[] = [];
    for (let item of arr) {
        const existingIndex = gridArr.findIndex(d => d.date === format(new Date(item.createdAt), "yyyy-MM-dd"));
        if (existingIndex > -1) gridArr[existingIndex].count += 1;
        else gridArr.push({
            date: format(new Date(item.createdAt), "yyyy-MM-dd"),
            count: 1,
        });
    }
    return gridArr;
}

type TabTypes = "snippets" | "posts" | "all";

export default function ActivityTabs({snippetsArr, postsArr, linkedSnippetsArr}: {snippetsArr: {createdAt: string}[], postsArr: {createdAt: string}[], linkedSnippetsArr: {count: number}[]}) {
    const [tab, setTab] = useState<TabTypes>("posts");

    const snippetsCount = snippetsArr ? snippetsArr.length : 0;
    const postsCount = postsArr ? postsArr.length : 0;
    const numLinkedSnippets = !!linkedSnippetsArr.length ? linkedSnippetsArr[0].count : 0;
    const percentLinked = numLinkedSnippets ? Math.round(numLinkedSnippets / snippetsCount * 100) : 0;

    const tabInfo: TabInfo[] = [
        {
            name: "posts",
            icon: <FiEdit/>,
            text: `${postsCount} posts`,
        },
        {
            name: "snippets",
            icon: <FiMessageSquare/>,
            text: `${snippetsCount} snippets`,
        },
        {
            name: "all",
            icon: null,
            text: `${percentLinked}% linked`,
        },
    ];

    return (
        <>
            <Tabs tabInfo={tabInfo} tab={tab} setTab={setTab}/>
            {{
                snippets: (
                    <ActivityGrid data={makeGridArr(snippetsArr)}/>
                ), posts: (
                    <ActivityGrid data={makeGridArr(postsArr)}/>
                ), all: (
                    <ActivityGraph snippetsArr={snippetsArr} postsArr={postsArr}/>
                )
            }[tab]}
        </>
    );
}