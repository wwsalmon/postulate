import {CommentObj, CommentWithAuthor, DatedObj, UserObj} from "../utils/types";
import Link from "next/link";
import {format, formatDistanceToNow} from "date-fns";
import {Dispatch, SetStateAction, useState} from "react";
import {responseInterface} from "swr";
import useSWR from "swr";
import {fetcher} from "../utils/utils";
import axios from "axios";
import SpinnerButton from "./spinner-button";
import Linkify from "react-linkify";
import {FiCornerDownRight} from "react-icons/all";
import {useSession} from "next-auth/client";
import UpModal from "./up-modal";

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
    const [session, loading] = useSession();
    const [body, setBody] = useState<string>(comment ? comment.body : "");
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const {data: author, error: authorError}: responseInterface<{ data: DatedObj<UserObj> }, any> = useSWR(`/api/user?id=${authorId || ""}`, authorId ? fetcher : () => null)

    const authorObj = authorId ? ((author && author.data) ? author.data : {name: "", image: "", username: ""}) : comment.author[0];
    const disablePost = !body || (comment ? body === comment.body : false);
    const isAuthor = session && comment && session.userId === comment.userId;

    function onSubmit() {
        const postData = authorId ? {
            targetId: targetId,
            parentCommentId: parentCommentId,
            body: body,
        } : {
            id: comment._id,
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

    function onDelete() {
        setDeleteLoading(true);

        axios.delete("/api/comment", { data: { id: comment ? comment._id : "" } }).then(() => {
            setDeleteLoading(false);
            setDeleteOpen(false);
            setIteration(iteration + 1);
        }).catch(e => {
            console.log(e);
            setDeleteLoading(false);
        })
    }

    return (
        <div className="flex w-full mb-8">
            <Link href={`/@${authorObj.username}`}>
                <a>
                    <img src={authorObj.image} alt={`Profile picture of ${authorObj.name}`} className={"w-10 rounded-full mr-4 mt-2" + (authorId ? " opacity-25" : "")}/>
                </a>
            </Link>
            <div className="w-full">
                {(comment && !isEdit) ? (
                    <>
                        <div className="flex items-center">
                            <Link href={`/@${authorObj.username}`}>
                                <a className="font-bold inline-block mr-3">{authorObj.name}</a>
                            </Link>
                            <span className="opacity-25">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                        </div>
                        <p className="mt-1 prose">
                            <Linkify>{comment.body}</Linkify>
                        </p>
                        <div className="mt-2 flex items-center">
                            <button className="mr-4 opacity-25 hover:opacity-50 transition">
                                Reply
                            </button>
                            {isAuthor && (
                                <>
                                    <button className="mr-4 opacity-25 hover:opacity-50 transition" onClick={() => setIsEdit(true)}>
                                        Edit
                                    </button>
                                    <button className="mr-4 opacity-25 hover:opacity-50 transition" onClick={() => setDeleteOpen(true)}>
                                        Delete
                                    </button>
                                    <UpModal isOpen={deleteOpen} setIsOpen={setDeleteOpen}>
                                        Are you sure you want to delete this comment?
                                        <div className="mt-4 flex">
                                            <SpinnerButton isLoading={deleteLoading} onClick={onDelete}>
                                                Delete
                                            </SpinnerButton>
                                            <button className="up-button text" onClick={() => setDeleteOpen(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </UpModal>
                                </>
                            )}
                        </div>
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
                                onClick={onSubmit}
                                isLoading={commentLoading}
                                isDisabled={disablePost}
                                noRightMargin={!isEdit}
                                className="small"
                            >
                                {isEdit ? "Save" : "Post"}
                            </SpinnerButton>
                            {isEdit && (
                                <button className="up-button small text" onClick={() => {
                                    setBody(comment.body);
                                    setIsEdit(false);
                                }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}