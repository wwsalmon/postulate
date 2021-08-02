import {DatedObj, SnippetObjGraph} from "../utils/types";
import React, {Dispatch, ReactNode, SetStateAction} from "react";
import SnippetItemLinkPreview from "./SnippetItemLinkPreview";
import SlateReadOnly from "./SlateReadOnly";
import SnippetLinkedPosts from "./SnippetLinkedPosts";
import {useSession} from "next-auth/client";

export default function SnippetModalReadArea({snippet, thisMoreMenu, isList, setTagsQuery, dark, large}: {
    snippet: DatedObj<SnippetObjGraph>,
    thisMoreMenu?: ReactNode,
    isList?: boolean,
    setTagsQuery?: Dispatch<SetStateAction<string[]>>,
    dark?: boolean,
    large?: boolean,
}) {
    const [session, loading] = useSession();

    return (
        <>
            <div className="flex">
                <div className="w-full" style={{minWidth: 0}}>
                    {snippet.url && (
                        <SnippetItemLinkPreview snippet={snippet}/>
                    )}
                    <div className={`prose ${dark ? "prose-dark" : ""} ${large ? "content" : ""} break-words`}>
                        <SlateReadOnly nodes={snippet.slateBody}/>
                    </div>
                    {!!snippet.linkArr.length && (
                        <>
                            <hr className="mb-8 mt-4"/>
                            <p className="up-ui-title">Linked resources ({snippet.linkArr.length}):</p>
                            {snippet.linkArr.map(d => (
                                <div className="my-2">
                                    <SnippetItemLinkPreview url={d.targetUrl}/>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                {session && session.userId === snippet.userId && thisMoreMenu}
            </div>
            {isList && (
                <div className="flex mt-4">
                    {snippet.tags && snippet.tags.map(tag => (
                        <button
                            className="font-bold opacity-50 mr-2"
                            onClick={() => setTagsQuery && setTagsQuery([tag])}
                        >#{tag}</button>
                    ))}
                </div>
            )}
            <SnippetLinkedPosts snippet={snippet}/>
        </>
    );
}