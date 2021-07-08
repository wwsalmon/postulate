import React, {Dispatch, ReactNode, SetStateAction} from "react";
import {TabInfo} from "../utils/types";

export default function Tabs({tabInfo, tab, setTab, className}: {tabInfo: TabInfo[], tab: string, setTab: Dispatch<SetStateAction<string>>, className?: string}) {
    return (
        <div className={"flex items-center mb-8 " + (className || "")}>
            {tabInfo.map(thisTab => (
                <button
                    className={`flex items-center mr-6 transition pb-2 border-b-2 ${tab === thisTab.name ? "font-bold up-border-gray-700" : "up-gray-400 hover:text-black border-transparent"}`}
                    onClick={() => setTab(thisTab.name)}
                >
                    {thisTab.icon}
                    <p className={thisTab.icon ? "ml-2" : ""}>{thisTab.text}</p>
                </button>
            ))}
        </div>
    );
}