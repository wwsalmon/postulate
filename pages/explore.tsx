import React, {useState} from "react";
import useSWR, {responseInterface} from "swr";
import {DatedObj, PostObjGraph} from "../utils/types";
import {fetcher} from "../utils/utils";
import UpSEO from "../components/up-seo";
import PostFeedItem from "../components/PostFeedItem";
import Masonry from "react-masonry-component";
import PaginationBar from "../components/PaginationBar";
import H1 from "../components/style/H1";
import UserSearch from "../components/UserSearch";
import Skeleton from "react-loading-skeleton";
import UpBanner from "../components/UpBanner";
import UpButton from "../components/UpButton";

export default function OldExplore({}: {  }) {
    const [page, setPage] = useState<number>(1);
    const {
        data,
        error
    }: responseInterface<{ posts: DatedObj<PostObjGraph>[], count: number }, any> = useSWR(`/api/post?publicFeed=true&page=${page}`, fetcher);

    const dataReady = data && data.posts;

    return (
        <div className="max-w-5xl mx-auto px-4">
            <UpSEO title="Explore"/>
            <H1 className="mb-4">Explore</H1>
            <p className="up-gray-500">The latest public posts from users across the platform</p>
            <UpBanner className="my-8 sm:flex items-center">
                <p>New experiment: TikTok for knowledge. Scroll through a randomized feed of snippets</p>
                <div className="flex ml-auto">
                    <UpButton href="/sniptok" className="small text ml-auto">Check out SnipTok</UpButton>
                </div>
            </UpBanner>
            <hr className="my-8"/>
            <UserSearch/>
            {dataReady ? (
                <>
                    <Masonry className="mt-12 md:-mx-6 w-full" options={{transitionDuration: 0}}>
                        {data && data.posts && data.posts.map((post, i) => (
                            <PostFeedItem post={post} i={i} showAuthor={true}/>
                        ))}
                    </Masonry>
                    {data && data.posts && data.count > 10 && (
                        <div className="flex mb-12">
                            <button
                                className="text small up-button"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Back
                            </button>
                            <button
                                className="ml-auto text small up-button"
                                onClick={() => setPage(page + 1)}
                                disabled={page === Math.floor(data.count / 10)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : <Skeleton count={4}/>}
        </div>
    )
}