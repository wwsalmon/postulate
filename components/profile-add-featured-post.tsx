import {Dispatch, SetStateAction, useState} from "react";

export default function ProfileAddFeaturedPost({iteration, setIteration}: {
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    return (
        <></>
    );
}