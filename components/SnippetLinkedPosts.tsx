import {DatedObj, IdObj, ProjectObjBasicWithOwner, SnippetObjGraph} from "../utils/types";
import PostFeedItem from "./PostFeedItem";

export default function SnippetLinkedPosts({snippet}: {snippet: DatedObj<SnippetObjGraph>}) {
    return !!snippet.linkedPosts.length ? (
        <div className="opacity-50 hover:opacity-100 transition pb-8">
            <hr className="mb-8 mt-4"/>
            <p className="up-ui-title mb-12">Linked posts ({snippet.linkedPosts.length}):</p>
            {snippet.linkedPostsArr.map((d, i) => (
                <PostFeedItem post={d} notFeed={true} i={i}/>
            ))}
        </div>
    ) : <></>;
}