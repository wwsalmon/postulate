import {DatedObj, ProjectObj} from "../utils/types";
import {UserObjWithProjects} from "../pages/[username]";
import Link from "next/link";
import H3 from "./style/H3";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useSession} from "next-auth/client";
import {FiX} from "react-icons/fi";
import UpModal from "./up-modal";
import SpinnerButton from "./spinner-button";
import axios from "axios";

export default function ProfileProjectItem({project, thisUser, iter, setIter}: {
    project: DatedObj<ProjectObj>,
    thisUser: DatedObj<UserObjWithProjects>,
    iter: number,
    setIter: Dispatch<SetStateAction<number>>,
}) {
    const [session, loading] = useSession();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const isOwner = session && (session.userId === project.userId);

    function onDelete() {
        setDeleteLoading(true);

        axios.delete(`/api/project/feature`, {
            data: {
                id: project._id,
            },
        }).then(() => {
            setDeleteLoading(false);
            setDeleteOpen(false);
            setIter(iter + 1);
        }).catch(e => {
            setDeleteLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="p-4 rounded-md border up-border-gray-200 hover:shadow transition cursor-pointer relative up-hover-parent">
            <Link href={"/@" + thisUser.username + "/" + project.urlName}>
                <a>
                    <H3 className="mb-2">{project.name}</H3>
                    <p className="break-words up-gray-400">{project.description}</p>
                </a>
            </Link>
            {isOwner && (
                <>
                    <div className="up-hover-child absolute bottom-2 right-2">
                        <button
                            className="h-8 w-8 hover:shadow-lg transition rounded-full flex items-center justify-center up-gray-400 bg-white border"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <FiX/>
                        </button>
                    </div>
                    <UpModal isOpen={deleteOpen} setIsOpen={setDeleteOpen}>
                        <p>Are you sure you want to remove this project from your featured projects?</p>
                        <div className="flex mt-4">
                            <SpinnerButton
                                isLoading={deleteLoading}
                                onClick={onDelete}
                            >
                                Remove
                            </SpinnerButton>
                            <button className="up-button text" onClick={() => setDeleteOpen(false)}>Cancel</button>
                        </div>
                    </UpModal>
                </>
            )}
        </div>
    );
}