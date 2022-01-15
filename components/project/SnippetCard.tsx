import TruncatedText from "../standard/TruncatedText";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {DatedObj, SnippetObj} from "../../utils/types";
import UiModal from "../style/UiModal";
import axios from "axios";
import {Node} from "slate";
import AutosavingEditor from "../standard/AutosavingEditor";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import ConfirmModal from "../standard/ConfirmModal";

export default function SnippetCard({snippet: initSnippet, iter, setIter, snippetId, setSnippetId}: {snippet: DatedObj<SnippetObj>, iter: number, setIter: Dispatch<SetStateAction<number>>, snippetId: string, setSnippetId: Dispatch<SetStateAction<string>>}) {
    const [isOpen, setIsOpen] = useState<boolean>(snippetId === initSnippet._id);
    const [snippet, setSnippet] = useState<DatedObj<SnippetObj>>(initSnippet);
    const [saveStatus, setSaveStatus] = useState<string>("");
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    async function submitAndUpdateBody(body: Node[]) {
        try {
            const {data: {snippet: newSnippet}} = await axios.post("/api/snippet", {
                id: snippet._id,
                body: body,
            });

            setIter(iter + 1);
            setSnippet(newSnippet);

            return;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete(`/api/snippet`, {data: {id: snippet._id}}).then(() => {
            setIter(iter + 1);
            setIsOpen(false);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    useEffect(() => {
        if (snippetId === snippet._id) setSnippetId("");
    }, [snippetId]);

    return (
        <>
            <button key={snippet._id} className="p-4 border border-gray-300 rounded-md mb-4 text-left w-full block hover:bg-gray-50 transition" onClick={() => setIsOpen(true)}>
                <TruncatedText value={snippet.slateBody}/>
            </button>
            <UiModal isOpen={isOpen} setIsOpen={setIsOpen} wide={true}>
                <div className="sm:px-2">
                    <AutosavingEditor
                        prevValue={snippet.slateBody}
                        onSubmitEdit={submitAndUpdateBody}
                        setStatus={setSaveStatus}
                        fontSize={18}
                        hideStatus={true}
                    />
                    <div className="flex items-center font-manrope text-gray-400 font-semibold text-sm mt-2">
                        <span className="mr-6">{saveStatus}</span>
                        {snippet.updatedAt !== snippet.createdAt && (
                            <span className="mr-6">Last updated {format(new Date(snippet.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        )}
                        <span className="mr-6">Created {format(new Date(snippet.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                            <MoreMenuItem onClick={() => setIsDeleteOpen(true)}>Delete</MoreMenuItem>
                        </MoreMenu>
                        <ConfirmModal
                            isOpen={isDeleteOpen}
                            setIsOpen={setIsDeleteOpen}
                            isLoading={isDeleteLoading}
                            setIsLoading={setIsDeleteLoading}
                            onConfirm={onDelete}
                            confirmText="Delete"
                        >
                            Are you sure you want to delete this snippet? This action is irreversible.
                        </ConfirmModal>
                    </div>
                </div>
            </UiModal>
        </>
    );
}