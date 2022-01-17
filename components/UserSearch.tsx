import React, {useState} from "react";
import {DatedObj, UserObj} from "../utils/types";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import Link from "next/link";

export default function UserSearch() {
    const [query, setQuery] = useState<string>("");
    const {data} = useSWR<{results: DatedObj<UserObj>[]}>(`/api/search/user?query=${query}`, query.length ? fetcher : async () => []);

    return (
        <>
            <input
                type="text"
                className="border p-2 mb-4 w-full rounded-md"
                placeholder="Search for a Postulate user"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                }}
            />
            {data && data.results && data.results.length ? (
                <>
                    {data.results.map(user => (
                        <Link href={`/@${user.username}`}>
                            <a className="flex items-center py-4 hover:bg-gray-100 px-4">
                                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-4"/>
                                <p>{user.name} (@{user.username})</p>
                            </a>
                        </Link>
                    ))}
                </>
            ) : (query && (
                <p className="up-gray-400">No results found</p>
            ))}
        </>
    );
}