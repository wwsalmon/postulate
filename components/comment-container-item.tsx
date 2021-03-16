import React, {Dispatch, SetStateAction, useState} from "react";
import {CommentWithAuthor, DatedObj} from "../utils/types";
import CommentItem from "./comment-item";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import Accordion from "react-robust-accordion";

export default function CommentContainerItem({iteration, setIteration, comment, subComments}: {
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>,
    comment: DatedObj<CommentWithAuthor>,
    subComments: DatedObj<CommentWithAuthor>[],
}) {
    const [subCommentsOpen, setSubCommentsOpen] = useState<boolean>(false);

    return (
        <>
            <CommentItem comment={comment} iteration={iteration} setIteration={setIteration}/>
            {!!subComments.length && (
                <div className="pl-14 mb-4">
                    <Accordion openState={subCommentsOpen} setOpenState={setSubCommentsOpen} label={(
                        <div className="-mt-4 mb-8 flex items-center opacity-50 hover:opacity-100 transition">
                            <p>Show replies ({subComments.length})</p>
                            <div className="ml-auto">
                                {subCommentsOpen ? (
                                    <FiChevronUp/>
                                ) : (
                                    <FiChevronDown/>
                                )}
                            </div>
                        </div>
                    )}>
                        {subComments.map(subComment => (
                            <CommentItem
                                comment={subComment}
                                iteration={iteration}
                                setIteration={setIteration}
                            />
                        ))}
                    </Accordion>
                </div>
            )}
        </>
    );
}