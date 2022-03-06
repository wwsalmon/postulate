import React from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import UserSearch from "../components/UserSearch";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import {DatedObj, NodeObj, NodeObjPublic, ProjectObj, UserObj} from "../utils/types";
import UserButton from "../components/standard/UserButton";
import PostItem from "../components/project/PostItem";
import NodeCard from "../components/project/NodeCard";
import InlineButton from "../components/style/InlineButton";
import getProjectUrl from "../utils/getProjectUrl";
import ReactTimeAgo from "react-time-ago";
import Link from "next/link";
import ExploreNodeCard from "../components/explore/ExploreNodeCard";

export default function OldExplore({}: {  }) {
    const {data, error} = useSWR<{activity: (DatedObj<NodeObj> & {userArr: DatedObj<UserObj>[], projectArr: DatedObj<ProjectObj>[]})[]}>("/api/activity", fetcher);

    let groupedData: {
        user: DatedObj<UserObj>,
        projects: {
            project: DatedObj<ProjectObj>,
            items: DatedObj<NodeObj>[],
        }[],
    }[] = [];
    if (data) {
        for (const i in data.activity) {
            const item = data.activity[i];
            const prevItem = (+i > 0) && data.activity[+i - 1];
            const isSameUser = prevItem && prevItem.userId === item.userId;

            if (isSameUser) {
                const currentGroupedUser = groupedData[groupedData.length - 1];
                const currentGroupedUserSameProjectIndex = currentGroupedUser.projects.findIndex(d => d.project._id === item.projectId);

                if (currentGroupedUserSameProjectIndex > -1) {
                    groupedData[groupedData.length - 1].projects[currentGroupedUserSameProjectIndex].items = [
                        ...currentGroupedUser.projects[currentGroupedUserSameProjectIndex].items,
                        item,
                    ];
                } else {
                    groupedData[groupedData.length - 1] = {
                        user: currentGroupedUser.user,
                        projects: [
                            ...currentGroupedUser.projects,
                            {
                                project: item.projectArr[0],
                                items: [item],
                            }
                        ],
                    }
                }

            } else {
                groupedData.push({
                    user: item.userArr[0],
                    projects: [
                        {
                            project: item.projectArr[0],
                            items: [item],
                        }
                    ],
                });
            }
        }
    }

    return (
        <div className="w-full bg-gray-100 -mt-8 pt-16 -mb-12">
            <div className="max-w-3xl mx-auto px-4">
                <SEO title="Explore"/>
                <H1 className="mb-4">Explore</H1>
                {/*<hr className="my-8"/>*/}
                {/*<UserSearch/>*/}
                <hr className="my-8"/>
                {groupedData.map((group, i) => (
                    <div className="sm:flex my-12" key={i}>
                        <div className="w-24 flex-shrink-0 text-sm text-gray-500 mb-8">
                            <ReactTimeAgo
                                date={new Date((group.projects[0].items[0] as NodeObjPublic).body.publishedDate)}
                                timeStyle="twitter"
                                locale="en-US"
                            />
                        </div>
                        <div className="flex-grow overflow-hidden">
                            {group.projects.length > 1 && (
                                <div className="flex items-center mb-2 text-sm">
                                    <UserButton user={group.user} imageSizeClasses="w-5 h-5"/>
                                    <span className="mx-2"> published {group.projects.reduce((a, b) => a + b.items.length, 0)} note{group.projects.reduce((a, b) => a + b.items.length, 0) > 1 && "s"}</span>
                                </div>
                            )}
                            {group.projects.map((projectGroup, i) => (
                                <div key={i}>
                                    <div className={`flex items-center text-sm ${group.projects.length <= 1 ? "mb-4" : "mt-6 mb-2"}`}>
                                        {group.projects.length <= 1 && (
                                            <>
                                                <UserButton user={group.user} imageSizeClasses="w-5 h-5"/>
                                                <span className="mx-2"> published {projectGroup.items.length} note{projectGroup.items.length > 1 && "s"} in</span>
                                            </>
                                        )}
                                        <InlineButton href={getProjectUrl(group.user, projectGroup.project)}>{projectGroup.project.name}</InlineButton>
                                    </div>
                                    {(projectGroup.items as DatedObj<NodeObjPublic>[]).map((item, i) => (
                                        <ExploreNodeCard
                                            pageUser={group.user}
                                            pageNode={item}
                                            pageProject={projectGroup.project}
                                            className="mb-3"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}