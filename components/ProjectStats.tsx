import ReactFrappeChart from "./frappe-chart";
import {format} from "date-fns";
import {arrGraphGenerator, arrToDict} from "../utils/utils";
import GitHubCalendar from "react-github-contribution-calendar/lib";
import React from "react";
import useSWR, {responseInterface} from "swr";

export default function ProjectStats({projectId, statsIter = 0}: {projectId: string, statsIter?: number}) {
    const {data: stats, error: statsError}: responseInterface<{ postDates: {createdAt: string}[], snippetDates: {createdAt: string}[], linkedSnippetsCount: number }, any> = useSWR(`/api/project/stats?projectId=${projectId}&iter=${statsIter}`);

    const statsReady = stats && stats.postDates && stats.snippetDates;
    const numPosts = statsReady ? stats.postDates.length : 0;
    const numSnippets = statsReady ? stats.snippetDates.length : 0;
    const numLinkedSnippets = statsReady ? stats.linkedSnippetsCount : 0;
    const percentLinked = numLinkedSnippets ? Math.round(numLinkedSnippets / numSnippets * 100) : 0;
    const snippetDates = statsReady ? arrToDict(stats.snippetDates) : {};
    const postDates = statsReady ? arrToDict(stats.postDates) : {};
    const numGraphDays = 30;

    return (
        <div className="my-8 lg:flex -mx-4">
            <div className="lg:w-1/3 mx-4">
                <h3 className="up-ui-title">Overview ({percentLinked}% linked)</h3>
                <p className="mb-4 up-gray-500 text-sm">Linked percentage is the percentage of snippets that are linked to at least one post.</p>
                <ReactFrappeChart
                    type="line"
                    colors={["#ccd4ff", "#0026ff"]}
                    axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                    lineOptions={{ regionFill: 1, hideDots: 1 }}
                    height={250}
                    animate={false}
                    data={{
                        labels: Array(numGraphDays).fill(0).map((d, i) => {
                            const currDate = new Date();
                            const thisDate = +currDate - (1000 * 24 * 3600) * (numGraphDays - 1 - i);
                            return format(new Date(thisDate), "M/d");
                        }),
                        datasets: [
                            {
                                name: "Snippets",
                                values: arrGraphGenerator(snippetDates, numGraphDays),
                            },
                            {
                                name: "Posts",
                                values: arrGraphGenerator(postDates, numGraphDays),
                            },
                        ],
                    }}
                />
            </div>
            <hr className="my-8 lg:hidden"/>
            <div className="md:flex lg:w-2/3">
                <div className="md:w-1/2 mx-4">
                    <h3 className="up-ui-title mb-4">Snippets ({numSnippets})</h3>
                    {/*
                            // @ts-ignore*/}
                    <GitHubCalendar
                        panelColors={[
                            "#eeeeee",
                            "#ccd4ff",
                            "#99a8ff",
                            "#667dff",
                            "#3351ff",
                            ...Array(50).fill("#0026ff"),
                        ]}
                        values={snippetDates}
                        until={format(new Date(), "yyyy-MM-dd")}
                    />
                </div>
                <hr className="my-8 md:hidden"/>
                <div className="md:w-1/2 mx-4">
                    <h3 className="up-ui-title mb-4">Posts ({numPosts})</h3>
                    {/*
                            // @ts-ignore*/}
                    <GitHubCalendar
                        panelColors={[
                            "#eeeeee",
                            "#ccd4ff",
                            "#99a8ff",
                            "#667dff",
                            "#3351ff",
                            ...Array(50).fill("#0026ff"),
                        ]}
                        values={postDates}
                        until={format(new Date(), "yyyy-MM-dd")}
                    />
                </div>
            </div>
        </div>
    );
}