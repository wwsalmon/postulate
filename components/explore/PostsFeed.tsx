import axios from "axios";
import useLoadMore from "./useLoadMore";
import {Activity} from "./ActivityFeed";
import HomePostItem from "../project/HomePostItem";
import UiButton from "../style/UiButton";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default function PostsFeed({userId, className}: {userId?: string, className?: string}) {
    const [items, handleLoadMore, isLoading] = useLoadMore<Activity>(
        async (page: number) => {
            let url = `/api/activity?page=${page}&type=post`;

            if (userId) url += `&userId=${userId}`;

            const res = await axios.get(url);
            return res.data.activity as Activity[];
        }
    )

    return (
        <div className={className || ""}>
            {items.length ? items.map(post => (
                <HomePostItem
                    pageUser={post.userArr[0]}
                    pageProject={post.projectArr[0]}
                    thisUser={null}
                    pageNode={post}
                    key={post._id}
                    className="mb-12 block"
                    showAuthor={!userId}
                    showProject={true}
                />
            )) : (
                <Skeleton height={120} count={3}/>
            )}
            {!!items.length && (
                <div className="flex items-center justify-center py-8">
                    <UiButton onClick={handleLoadMore} isLoading={isLoading}>Load more</UiButton>
                </div>
            )}
        </div>
    );
};