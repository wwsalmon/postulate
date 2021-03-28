import React, {Dispatch, SetStateAction, useState} from "react";
import useSWR, {responseInterface} from "swr";
import {DatedObj, PostObjGraph, UserObj} from "../utils/types";
import {fetcher} from "../utils/utils";
import PublicPostItem from "./public-post-item";
import Skeleton from "react-loading-skeleton";

export default function ProfileAddFeaturedPost({iteration, setIteration, thisUser, setOpen, featuredPostIds}: {
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    thisUser: DatedObj<UserObj>,
    setOpen: Dispatch<SetStateAction<boolean>>,
    featuredPostIds: string[],
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [selectedPostId, setSelectedPostId] = useState<string>(null);

    const {data: posts, error: postsError}: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?userId=${thisUser._id}&page=${page}&search=${searchQuery}`, fetcher);

    const postsReady = posts && posts.posts;
    const filteredPosts = postsReady ? posts.posts.filter(d => !featuredPostIds.includes(d._id)) : [];

    return (
        <>
            <h3 className="up-ui-title mb-4">Select a post to feature</h3>
            <input
                type="text"
                className="border-b py-2 mb-8 w-full"
                placeholder="Search"
                value={searchQuery}
                onChange={e => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                }}
            />
            {postsReady ? filteredPosts.length > 0 ? (
                <div style={{maxHeight: "calc(100vh - 400px)", overflowY: "auto"}} className="-mr-4">
                    <div className="pr-4">
                        {filteredPosts.map(post => (
                            <div className="flex">
                                <input
                                    type="checkbox"
                                    checked={selectedPostId === post._id}
                                    onChange={() => {
                                        if (selectedPostId === post._id) setSelectedPostId(null);
                                        else setSelectedPostId(post._id);
                                    }}
                                    className="mr-4 mt-2 opacity-50 hover:opacity-100 w-4 h-4 flex-shrink-0"
                                />
                                <PublicPostItem
                                    post={post}
                                    showProject={true}
                                />
                            </div>
                        ))}
                    </div>

                    {posts.count > 10 && (
                        <>
                            <p className="opacity-25 mt-8">
                                Showing posts {(page - 1) * 10 + 1}
                                -{(page < Math.floor(posts.count / 10)) ? page * 10 : posts.count} of {posts.count}
                            </p>
                            <div className="mt-4">
                                {Array.from({length: Math.ceil(posts.count / 10)}, (x, i) => i + 1).map(d => (
                                    <button
                                        className={"py-2 px-4 rounded-md mr-2 " + (d === page ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                                        onClick={() => setPage(d)}
                                        disabled={+d === +page}
                                    >{d}</button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>No public posts have been published by this user yet.</p>
            ) : (
                <Skeleton count={1} className="h-64 md:w-1/3 sm:w-1/2 w-full"/>
            )}
            <div className="mt-4 flex items-center">
                <button className="up-button primary mr-4" disabled={!selectedPostId}>Add</button>
                <button className="up-button text" onClick={() => setOpen(false)}>Cancel</button>
            </div>
        </>
    );
}