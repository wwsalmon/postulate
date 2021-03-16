import {CommentObj, CommentWithAuthor, DatedObj, UserObj} from "../utils/types";
import Link from "next/link";
import {format} from "date-fns";
import {Dispatch, SetStateAction, useState} from "react";
import {responseInterface} from "swr";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import axios from "axios";
import SpinnerButton from "./spinner-button";
import Linkify from "react-linkify";

interface PropsBase {
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
}

interface PropsNew extends PropsBase {
    authorId: any,
    targetId: string,
    parentCommentId?: string,
    comment?: never,
}

interface PropsExisting extends PropsBase {
    authorId?: never,
    targetId?: never,
    parentCommentId?: never,
    comment?: DatedObj<CommentWithAuthor>,
}

export default function CommentItem({ authorId, comment, targetId, parentCommentId, iteration, setIteration }: PropsNew | PropsExisting) {
    const [body, setBody] = useState<string>(comment ? comment.body : "");
    const [commentLoading, setCommentLoading] = useState<boolean>(false);

    const {data: author, error: authorError}: responseInterface<{ data: DatedObj<UserObj> }, any> = useSWR(`/api/user?id=${authorId || ""}`, authorId ? fetcher : () => null)

    const authorObj = authorId ? ((author && author.data) ? author.data : {name: "", image: "", username: ""}) : comment.author[0];
    const disablePost = !body || (comment ? body === comment.body : false);

    function PostComment() {
        const postData = authorId ? {
            targetId: targetId,
            parentCommentId: parentCommentId,
            body: body,
        } : {
            body: body,
        }

        setCommentLoading(true);

        axios.post("/api/comment", postData).then(() => {
            setBody("");
            setCommentLoading(false);
            setIteration(iteration + 1);
        }).catch(e => {
            setCommentLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="flex w-full mb-8">
            <Link href={`/@${authorObj.username}`}>
                <a>
                    <img src={authorObj.image} alt={`Profile picture of ${authorObj.name}`} className={"w-10 rounded-full mr-4" + (authorId ? " mt-2 opacity-25" : "")}/>
                </a>
            </Link>
            <div className="w-full">
                {comment ? (
                    <>
                        <div className="flex items-center">
                            <Link href={`/@${authorObj.username}`}>
                                <a className="font-bold inline-block mr-3">{authorObj.name}</a>
                            </Link>
                            <span className="opacity-25">{format(new Date(comment.createdAt), "M/d/yyyy 'at' h:mm a")}</span>
                        </div>
                        <p className="mt-2 prose">
                            <Linkify>{comment.body}</Linkify>
                        </p>
                    </>
                ) : (
                    <>
                        <textarea
                            placeholder="Write a comment..."
                            className="p-4 border rounded-md w-full"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                        />
                        <div className="flex w-full justify-end mb-4">
                            <SpinnerButton
                                onClick={PostComment}
                                isLoading={commentLoading}
                                isDisabled={disablePost}
                                noRightMargin
                                className="small"
                            >
                                Post
                            </SpinnerButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}