import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import {useState} from "react";
import {getTextAreaStateProps} from "react-controlled-component-helpers";
import SignInButton from "../standard/SignInButton";
import {DatedObj, UserObj} from "../../utils/types";
import {NodeWithShortcut} from "./MainShell";
import UiH3 from "../style/UiH3";
import UiButton from "../style/UiButton";
import axios from "axios";
import UserButton from "../standard/UserButton";
import {format} from "date-fns";
import InlineButton from "../style/InlineButton";
import {FiCornerUpRight, FiHeart, FiTrash} from "react-icons/fi";
import {CommentObj} from "../../models/comment";
import ConfirmModal from "../standard/ConfirmModal";
import {useRouter} from "next/router";
import {LikeObj} from "../../models/like";

function CommentForm({
                         pageNode,
                         thisUser,
                         callback,
                         onCancel,
                         parentId
                     }: { pageNode: DatedObj<NodeWithShortcut>, thisUser: DatedObj<UserObj>, callback: () => any, onCancel: () => any, parentId?: string }) {
    const [newComment, setNewComment] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onSubmit() {
        setIsLoading(true);

        let commentData = {
            body: newComment,
            nodeId: pageNode._id,
        }

        if (parentId) commentData["parentId"] = parentId;

        axios.post("/api/comment", commentData).then(() => {
            setIsLoading(false);
            setNewComment("");
            callback();
        });
    }

    function onCancelPress() {
        setNewComment("");
        onCancel();
    }

    return (
        <>
            <div className="relative my-4">
                <textarea {...getTextAreaStateProps(newComment, setNewComment)} className="w-full h-full overflow-hidden p-3 border rounded-md absolute top-0 left-0"
                    placeholder="Write a comment..."
                    style={{resize: "none"}}
                />
                <p className="invisible p-3 border">{newComment}<br/></p>
            </div>
            <div className="flex items-center">
                <UiButton
                    noBg={true}
                    className="ml-auto mr-2"
                    disabled={isLoading}
                    onClick={onCancelPress}
                >Cancel</UiButton>
                <UiButton disabled={!newComment} isLoading={isLoading} onClick={onSubmit}>Post</UiButton>
            </div>
        </>
    );
}

function CommentItem({
                         comment,
                         thisUser,
                         pageNode,
                         callback
                     }: { comment: DatedObj<CommentApiResponse | CommentApiBase>, thisUser: DatedObj<UserObj>, pageNode: DatedObj<NodeWithShortcut>, callback: () => any }) {
    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [likesIter, setLikesIter] = useState<number>(0);

    const {data: likesData} = useSWR<(DatedObj<LikeObj> & {user: DatedObj<UserObj>})[]>(`/api/like?nodeId=${comment._id}&iter=${likesIter}`, fetcher);

    const router = useRouter();

    function onReplyButton() {
        if (thisUser) setIsReplyOpen(true);
        else router.push("/auth/signin");
    }

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete("/api/comment", {data: {id: comment._id}}).then(callback);
    }

    function onLike() {
        if (thisUser) {
            axios.post("/api/like", {nodeId: comment._id}).then(() => setLikesIter(prev => prev + 1));
        } else router.push("/auth/signin");
    }

    const thisUserLiked = (likesData && thisUser && likesData.some(d => d.user._id === thisUser._id));

    return (
        <div className="my-12">
            <div className="flex items-center">
                <UserButton user={comment.user}/>
                <span className="ml-auto text-gray-400 font-manrope font-semibold text-sm">{format(new Date(comment.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <p className="text-lg mt-2">{comment.body}</p>
            <div className="flex items-center my-2">
                <InlineButton
                    onClick={onReplyButton}
                    flex={true}
                    className="mr-4"
                    disabled={isReplyOpen}
                ><FiCornerUpRight/><span className="ml-2">Reply</span></InlineButton>
                {thisUser && comment.userId === thisUser._id && (
                    <>
                        <InlineButton
                            flex={true}
                            className="mr-4"
                            onClick={() => setIsDeleteOpen(true)}
                        ><FiTrash/><span className="ml-2">Delete</span></InlineButton>
                        <ConfirmModal
                            isOpen={isDeleteOpen}
                            setIsOpen={setIsDeleteOpen}
                            isLoading={isDeleteLoading}
                            setIsLoading={setIsDeleteLoading}
                            onConfirm={onDelete}
                            confirmText="Delete"
                            colorClass="bg-red-500 hover:bg-red-700"
                        >
                            Are you sure you want to delete this comment?
                        </ConfirmModal>
                    </>
                )}
                <InlineButton
                    onClick={onLike}
                    className={`mr-2 ${thisUserLiked ? "text-red-500" : ""}`}
                >
                    <FiHeart/>
                </InlineButton>
                {likesData && likesData.map(like => (
                    <UserButton user={like.user} hideName={true} imageSizeClasses="w-4 h-4" className="mr-0" key={like._id}/>
                ))}
            </div>
            <div className="pl-8 border-l">
                {isReplyOpen && (
                    <CommentForm
                        pageNode={pageNode}
                        thisUser={thisUser}
                        callback={callback}
                        onCancel={() => setIsReplyOpen(false)}
                        parentId={comment.parentId || comment._id}
                    />
                )}
                {"subComments" in comment && comment.subComments.map(subComment => (
                    <CommentItem comment={subComment} thisUser={thisUser} pageNode={pageNode} callback={callback} key={subComment._id}/>
                ))}
            </div>
        </div>
    );
}

interface CommentApiBase extends CommentObj {
    user: DatedObj<UserObj>,
}

interface CommentApiResponse extends CommentApiBase {
    subComments: DatedObj<CommentApiBase>[],
}

export default function Comments({pageNode, thisUser}: PublicNodePageProps) {
    const [commentsIter, setCommentsIter] = useState<number>(0);
    const {data: commentsData} = useSWR<DatedObj<CommentApiResponse>[]>(`/api/comment?nodeId=${pageNode._id}&iter=${commentsIter}`, fetcher);

    return (
        <>
            <UiH3 className="mb-4">Comments ({commentsData ? commentsData.length : "loading..."})</UiH3>
            {thisUser ? (
                <>
                    <CommentForm
                        pageNode={pageNode}
                        thisUser={thisUser}
                        callback={() => setCommentsIter(prev => prev + 1)}
                        onCancel={() => null}
                    />
                </>
            ) : (
                <div className="flex items-center">
                    <span>Sign in to comment</span>
                    <SignInButton className="ml-auto"/>
                </div>
            )}
            {commentsData && commentsData.map(comment => (
                <CommentItem
                    comment={comment}
                    thisUser={thisUser}
                    key={comment._id}
                    pageNode={pageNode}
                    callback={() => setCommentsIter(prev => prev + 1)}
                />
            ))}
        </>
    );
}