import Link from "next/link";
import React from "react";
import {DatedObj, SnippetObjGraph} from "../utils/types";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import ellipsize from "ellipsize";

export default function SnippetItemLinkPreview({snippet, small}: {snippet: DatedObj<SnippetObjGraph>, small?: boolean}) {
    const {data: linkPreview, error: linkPreviewError} = useSWR(`/api/link-preview?url=${snippet.url}`, snippet.url ? fetcher : () => null);

    return (
        <Link href={snippet.url}>
            <a className={small ? "flex mb-2" : "p-4 rounded-md shadow-md mb-8 flex opacity-50 hover:opacity-100 transition w-full"}>
                <div>
                    <p className="opacity-50 break-all">{ellipsize(snippet.url, 50)}</p>
                    {linkPreview && (
                        <div className="mt-2">
                            <p className={small ? "font-bold" : "up-ui-item-title"}>{linkPreview.title}</p>
                            {linkPreview.description && (
                                <p>{linkPreview.description}</p>
                            )}
                        </div>
                    )}
                </div>
                {linkPreview && linkPreview.images && linkPreview.images.length && (
                    <div className={`${small ? "w-16" : "w-24"} ml-auto pl-4 flex-shrink-0`}>
                        <img src={linkPreview.images[0]} className="w-full"/>
                    </div>
                )}
            </a>
        </Link>
    )
}