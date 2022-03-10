import React, {useState} from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import ActivityFeed from "../components/explore/ActivityFeed";
import useSWR from "swr";
import {DatedObj, UserObj} from "../utils/types";
import {fetcher} from "../utils/utils";
import UserButton from "../components/standard/UserButton";
import {FiSearch} from "react-icons/fi";
import {getInputStateProps} from "react-controlled-component-helpers";
import PostsFeed from "../components/explore/PostsFeed";
import TabButton from "../components/style/TabButton";

function ExploreUserSearch() {
    const [query, setQuery] = useState<string>("");

    const {data} = useSWR<{results: DatedObj<UserObj>[]}>(`/api/search/user?query=${query}`, query ? fetcher : async () => []);

    return (
        <>
            <div className="md:flex items-center my-4">
                <p>See what fellow Postulate users are learning, reading and writing.</p>
                <div className="flex items-center ml-auto my-6 md:my-0">
                    <FiSearch className="mr-2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Search users"
                        className="w-24 focus:outline-none" {...getInputStateProps(query, setQuery)}
                    />
                </div>
            </div>
            {data && data.results && data.results.length ? (
                <>
                    {data.results.map(user => (
                        <UserButton user={user} key={user._id} className="mr-4"/>
                    ))}
                </>
            ) : (query && (
                <p className="up-gray-400">No results found</p>
            ))}
        </>
    )
}

export default function Explore({}: {  }) {
    type TabOption = "Posts" | "All Activity";

    const [tab, setTab] = useState<TabOption>("Posts");

    return (
        <>
            <SEO title="Explore"/>
            <div className="max-w-3xl mx-auto px-4">
                <H1>Explore</H1>
                <ExploreUserSearch/>
                <div className="flex items-center mt-8 mb-4">
                    {["Posts", "All Activity"].map(option => (
                        <TabButton isActive={option === tab} onClick={() => setTab(option as TabOption)} key={option}>
                            {option}
                        </TabButton>
                    ))}
                </div>
                {tab === "Posts" && (
                    <PostsFeed className="mt-12"/>
                )}
            </div>
            {tab === "All Activity" && (
                <div className="w-full bg-gray-100 py-8 border-t">
                    <div className="max-w-3xl mx-auto px-4">
                        {/*<hr className="my-8"/>*/}
                        {/*<UserSearch/>*/}
                        <ActivityFeed/>
                    </div>
                </div>
            )}
        </>
    )
}