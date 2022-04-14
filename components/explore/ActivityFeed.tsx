import React, {useEffect, useRef, useState} from "react";
import {DatedObj, NodeObj, NodeObjPublic, ProjectObj, UserObj} from "../../utils/types";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import UserButton from "../standard/UserButton";
import InlineButton from "../style/InlineButton";
import getProjectUrl from "../../utils/getProjectUrl";
import ExploreNodeCard from "./ExploreNodeCard";
import Skeleton from "react-loading-skeleton";
import UiButton from "../style/UiButton";
import useLoadMore from "./useLoadMore";

export type Activity = DatedObj<NodeObj> & {userArr: DatedObj<UserObj>[], projectArr: DatedObj<ProjectObj>[]};

function ExplorePageFeed({activity}: {activity: Activity[]}) {
    let groupedData: {
        user: DatedObj<UserObj>,
        projects: {
            project: DatedObj<ProjectObj>,
            items: DatedObj<NodeObj>[],
        }[],
    }[] = [];

    for (const i in activity) {
        const item = activity[i];
        const prevItem = (+i > 0) && activity[+i - 1];
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

    return (
        <>
            {
                groupedData.map((group, i) => (
                    <div className="sm:flex mb-12" key={i}>
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
                                    <span className="mx-2 flex-shrink-0"> published {group.projects.reduce((a, b) => a + b.items.length, 0)} note{group.projects.reduce((a, b) => a + b.items.length, 0) > 1 && "s"}</span>
                                </div>
                            )}
                            {group.projects.map((projectGroup, i) => (
                                <div key={i}>
                                    <div className={`flex items-center text-sm ${group.projects.length <= 1 ? "mb-4" : "mt-6 mb-2"}`}>
                                        {group.projects.length <= 1 && (
                                            <>
                                                <UserButton user={group.user} imageSizeClasses="w-5 h-5"/>
                                                <span className="mx-2 flex-shrink-0"> published {projectGroup.items.length} note{projectGroup.items.length > 1 && "s"} in</span>
                                            </>
                                        )}
                                        <InlineButton
                                            href={getProjectUrl(group.user, projectGroup.project)}
                                            childClassName="truncate"
                                        >{projectGroup.project.name}</InlineButton>
                                    </div>
                                    {(projectGroup.items as DatedObj<NodeObjPublic>[]).map((item) => (
                                        <ExploreNodeCard
                                            pageUser={group.user}
                                            pageNode={item}
                                            pageProject={projectGroup.project}
                                            className="mb-3"
                                            key={item._id}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </>
    );
}

function UserPageFeed({activity}: {activity: Activity[]}) {
    let groupedData: {
        project: DatedObj<ProjectObj>,
        items: Activity[],
    }[] = [];

    for (const i in activity) {
        const item = activity[i];
        const prevItem = (+i > 0) && activity[+i - 1];
        const isSameProject = prevItem && prevItem.projectId === item.projectId;

        if (isSameProject) {
            groupedData[groupedData.length - 1].items = [
                ...groupedData[groupedData.length - 1].items,
                item,
            ];
        } else {
            groupedData.push({
                project: item.projectArr[0],
                items: [item],
            });
        }
    }

    return (
        <>
            {
                groupedData.map((group, i) => (
                    <div className="sm:flex mb-12" key={i}>
                        <div className="w-24 flex-shrink-0 text-sm text-gray-500 mb-8">
                            <ReactTimeAgo
                                date={new Date((group.items[0] as NodeObjPublic).body.publishedDate)}
                                timeStyle="twitter"
                                locale="en-US"
                            />
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <div className={`flex items-center text-sm mb-4`}>
                                <span className="mr-2 flex-shrink-0">published {group.items.length} note{group.items.length > 1 && "s"} in</span>
                                <InlineButton
                                    href={getProjectUrl(group.items[0].userArr[0], group.project)}
                                    childClassName="truncate"
                                >{group.project.name}</InlineButton>
                            </div>
                            {(group.items as DatedObj<NodeObjPublic>[]).map((item) => (
                                <ExploreNodeCard
                                    pageUser={group.items[0].userArr[0]}
                                    pageNode={item}
                                    pageProject={group.project}
                                    className="mb-3"
                                    key={item._id}
                                />
                            ))}
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default function ActivityFeed({userId}: {userId?: string}) {
    const [items, handleLoadMore, isLoading] = useLoadMore<Activity>(
        async (page: number) => {
            let url = `/api/activity?page=${page}`;

            if (userId) url += `&userId=${userId}`;

            const res = await axios.get(url);
            return res.data.activity as Activity[];
        }
    );

    return (
        <>
            {items.length ? userId ? <UserPageFeed activity={items}/> : <ExplorePageFeed activity={items}/> : isLoading ? (
                <div className="pb-32">
                    <Skeleton height={80} count={3}/>
                </div>
            ) : (
                <div className="pb-32">
                <p>No activity yet</p>
                </div>
            )}
            {!!items.length && (
                <div className="flex items-center justify-center py-8">
                    <UiButton onClick={handleLoadMore} isLoading={isLoading}>Load more</UiButton>
                </div>
            )}
        </>
    );
}