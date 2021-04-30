import React, {Dispatch, SetStateAction} from 'react';
import UpBanner from "./UpBanner";

export default function FilterBanner({searchQuery, setSearchQuery, tagsQuery, setTagsQuery}: {
    searchQuery: string,
    setSearchQuery: Dispatch<SetStateAction<string>>,
    tagsQuery: string[],
    setTagsQuery: Dispatch<SetStateAction<string[]>>,
}) {
    return (searchQuery || (tagsQuery && !!tagsQuery.length)) ? (
        <UpBanner className="my-4">
            <div className="flex items-center w-full">
                <p>Showing matches {searchQuery && `for "${searchQuery}" `}{tagsQuery && !!tagsQuery.length && "tagged "}{tagsQuery.map(tag => "#" + tag + " ")}</p>
                <button className="ml-auto up-button text small" onClick={() => {
                    setSearchQuery("");
                    setTagsQuery([]);
                }}>Clear</button>
            </div>
        </UpBanner>
    ) : <></>;
}