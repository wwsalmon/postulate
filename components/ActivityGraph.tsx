import {addDays, format, subDays} from "date-fns";
import ResizeObserver from "react-resize-observer";
import React, {useState} from "react";
import ReactFrappeChart from "./frappe-chart";

function makeGraphArr(arr: {createdAt: string}[], numDays: number) {
    const firstDayOnGraph = subDays(new Date(), numDays);
    let graphArr: number[] = [];
    let thisDay = firstDayOnGraph;
    while (thisDay <= new Date()) {
        const thisDayNum = arr
            .filter(d => format(new Date(d.createdAt), "yyyy-MM-dd") === format(new Date(thisDay), "yyyy-MM-dd"))
            .length;
        graphArr.push(thisDayNum);
        thisDay = addDays(thisDay, 1);
    }
    return graphArr;
}

export default function ActivityGraph({snippetsArr, postsArr}: {snippetsArr: {createdAt: string}[], postsArr: {createdAt: string}[]}) {
    const [numCols, setNumCols] = useState<number>(0);
    const [snippetsGraphArr, setSnippetsGraphArr] = useState<number[]>([]);
    const [postsGraphArr, setPostsGraphArr] = useState<number[]>([]);

    function onResize(rect) {
        const gridWidth = rect.width;
        const newNumCols = Math.floor((gridWidth - 64) / 8);
        setNumCols(newNumCols);
        setSnippetsGraphArr(makeGraphArr(snippetsArr, newNumCols));
        setPostsGraphArr(makeGraphArr(postsArr, newNumCols));
    }

    return (
        <div className="w-full">
            <ResizeObserver onResize={onResize}/>
            <ReactFrappeChart
                type="line"
                colors={["#ccd4ff", "#0026ff"]}
                axisOptions={{ xAxisMode: "tick", yAxisMode: "tick", xIsSeries: 1 }}
                lineOptions={{ regionFill: 1, hideDots: 1 }}
                height={250}
                animate={false}
                data={{
                    labels: Array(numCols).fill(0).map((d, i) => {
                        const currDate = new Date();
                        const thisDate = +currDate - (1000 * 24 * 3600) * (numCols - 1 - i);
                        return format(new Date(thisDate), "M/d");
                    }),
                    datasets: [
                        {
                            name: "Snippets",
                            values: snippetsGraphArr,
                        },
                        {
                            name: "Posts",
                            values: postsGraphArr,
                        },
                    ],
                }}
            />
        </div>
    );
}