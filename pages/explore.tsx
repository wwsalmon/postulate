import React from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import UserSearch from "../components/UserSearch";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../utils/types";
import UserButton from "../components/standard/UserButton";
import PostItem from "../components/project/PostItem";
import NodeCard from "../components/project/NodeCard";
import InlineButton from "../components/style/InlineButton";
import getProjectUrl from "../utils/getProjectUrl";

export default function OldExplore({}: {  }) {
    const {data, error} = useSWR<{activity: (DatedObj<NodeObj> & {userArr: DatedObj<UserObj>[], projectArr: DatedObj<ProjectObj>[]})[]}>("/api/activity", fetcher);

    console.log(data);

    return (
        <div className="max-w-5xl mx-auto px-4">
            <SEO title="Explore"/>
            <H1 className="mb-4">Explore</H1>
            <hr className="my-8"/>
            <UserSearch/>
            <hr className="my-8"/>
            <p>A full explore page is coming soon! <a href="https://twitter.com/postulateapp" className="underline">Follow Postulate on Twitter</a> for the latest updates.</p>
            {data && data.activity && data.activity.map(item => (
                <div key={item._id} className="my-16">
                    <div className="flex items-center my-4">
                        <UserButton user={item.userArr[0]}/>
                        <span className="mx-2"> published a{item.type === "evergreen" ? "n" : ""} {item.type} in</span>
                        <InlineButton href={getProjectUrl(item.userArr[0], item.projectArr[0])}>{item.projectArr[0].name}</InlineButton>
                    </div>
                    {item.type === "post" && (
                        <PostItem
                            pageUser={item.userArr[0]}
                            pageProject={item.projectArr[0]}
                            thisUser={null}
                            pageNode={item}
                        />
                    )}
                    {(item.type === "source" || item.type === "evergreen") && (
                        <NodeCard
                            pageUser={item.userArr[0]}
                            pageProject={item.projectArr[0]}
                            thisUser={null}
                            pageNode={item}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}