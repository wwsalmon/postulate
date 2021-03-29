import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, UserObj} from "../utils/types";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import Link from "next/link";

export default function NavbarSearchModal(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
    const [query, setQuery] = useState<string>("");
    const {data, error}: responseInterface<{results: DatedObj<UserObj>[]}, any> = useSWR(`/api/search/user?query=${query}`, query.length ? fetcher : () => []);

    return (
        <>
            <h3 className="up-ui-title mb-4">Search for user</h3>
            <input
                type="text"
                className="border-b py-2 mb-4 w-full"
                placeholder="Enter name or username"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                }}
            />
            {data && data.results && data.results.length ? (
                <>
                    {data.results.map(user => (
                        <Link href={`/@${user.username}`}>
                            <a
                                className="flex items-center py-4 hover:bg-gray-100 px-4 -mx-4"
                                onClick={() => props.setOpen(false)}
                            >
                                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-4"/>
                                <p>{user.name} (@{user.username})</p>
                            </a>
                        </Link>
                    ))}
                </>
            ) : (query && (
                <p className="opacity-50">No results found</p>
            ))}
        </>
    );
}