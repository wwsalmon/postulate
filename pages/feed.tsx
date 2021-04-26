import UpH1 from "../components/style/UpH1";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import PublicPostItem from "../components/public-post-item";
import React, {useState} from "react";
import {DatedObj, PostObjGraph} from "../utils/types";
import UpBanner from "../components/UpBanner";

export default function Feed({}: {  }) {
    const [page, setPage] = useState<number>(1);
    const {data, error}: responseInterface<{posts: DatedObj<PostObjGraph>[], count: number}, any> = useSWR(`/api/post?publicFeed=true&page=${page}`, fetcher);

    return (
        <div className="px-4 mx-auto max-w-4xl">
            <UpH1 className="mb-4">Feed</UpH1>
            <p className="up-gray-500">The latest posts from users and projects you follow</p>
            <hr className="my-16"/>
            {page > 1 && (
                <UpBanner className="-mt-8 mb-12 flex items-center">
                    <span>Showing <b>page {page}</b> of posts</span>
                    <button className="up-button text small ml-auto" onClick={() => setPage(1)}>Back to recent</button>
                </UpBanner>
            )}
            {data && data.posts && data.posts.map(post => (
                <PublicPostItem post={post} showAuthor={true} showProject={true}/>
            ))}
            {data && data.posts && data.count > 10 && (
                <div className="flex">
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
        </div>
    );
}