import UpH1 from "../components/style/UpH1";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import PublicPostItem from "../components/public-post-item";
import React, {useState} from "react";
import {DatedObj, PostObjGraph} from "../utils/types";
import UpBanner from "../components/UpBanner";
import UserSearch from "../components/UserSearch";
import PaginationBanner from "../components/PaginationBanner";

export default function Explore({}: {  }) {
    const [page, setPage] = useState<number>(1);
    const {data, error}: responseInterface<{posts: DatedObj<PostObjGraph>[], count: number}, any> = useSWR(`/api/post?publicFeed=true&page=${page}`, fetcher);

    return (
        <div className="px-4 mx-auto max-w-4xl">
            <UpH1 className="mb-4">Explore</UpH1>
            <p className="up-gray-500">The latest public posts from users across the platform</p>
            <hr className="my-8"/>
            <UserSearch/>
            <hr className="mt-8 mb-16"/>
            <PaginationBanner page={page} label="posts" setPage={setPage} className="-mt-8 mb-12"/>
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