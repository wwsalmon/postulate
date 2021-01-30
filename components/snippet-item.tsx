import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, SnippetObj} from "../utils/types";
import {format} from "date-fns";
import Parser from "html-react-parser";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";
import {FiEdit2, FiTrash} from "react-icons/fi";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import SpinnerButton from "./spinner-button";
import axios from "axios";
import UpModal from "./up-modal";

export default function SnippetItem({snippet, iteration, setIteration}: {
    snippet: DatedObj<SnippetObj>,
    iteration: number,
    setIteration: Dispatch<SetStateAction<number>>
}) {
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        extensions: [showdownHtmlEscape],
    });

    function onDelete() {
        setIsLoading(true);

        axios.post("/api/project/snippet/delete", {
            id: snippet._id.toString(),
        }).then(() => {
            setIsLoading(false);
            setIsDeleteOpen(false);
            setIteration(iteration + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <>
            <div className="py-8 border-b hover:bg-gray-50 transition flex">
                <div className="w-24 mt-1 opacity-25">
                    {format(new Date(snippet.createdAt), "h:mm a")}
                </div>
                <div>
                    {snippet.url && (
                        <div className="p-4 rounded-md shadow-md content mb-8">
                            <span>{snippet.url}</span>
                        </div>
                    )}
                    <div className="content prose">
                        {Parser(markdownConverter.makeHtml(snippet.body))}
                    </div>
                </div>
                <div className="ml-auto">
                    <MoreMenu>
                        <MoreMenuItem text="Edit" icon={<FiEdit2/>}/>
                        <MoreMenuItem text="Delete" icon={<FiTrash/>} onClick={() => setIsDeleteOpen(true)}/>
                    </MoreMenu>
                </div>
            </div>
            <UpModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}>
                <p>Are you sure you want to delete this snippet? This cannot be undone.</p>
                <div className="flex mt-4">
                    <SpinnerButton isLoading={isLoading} onClick={onDelete}>
                        Delete
                    </SpinnerButton>
                    <button className="up-button text" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                </div>
            </UpModal>
        </>
    );
}