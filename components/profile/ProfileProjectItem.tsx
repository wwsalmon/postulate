import {DatedObj, ProjectObjWithStats, UserObjWithProjects} from "../../utils/types";
import Link from "next/link";
import H4 from "../style/H4";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useSession} from "next-auth/client";
import {FiActivity, FiX} from "react-icons/fi";
import UiModal from "../style/UiModal";
import axios from "axios";
import ellipsize from "ellipsize";
import SEO from "../standard/SEO";
import {getWeek} from "date-fns";
import Button from "../headless/Button";

interface ProfileProjectItemPropsBase {
    project: DatedObj<ProjectObjWithStats>,
    thisUser: DatedObj<UserObjWithProjects>,
}

interface ProfileProjectItemPropsFeatured extends ProfileProjectItemPropsBase {
    iter: number,
    setIter: Dispatch<SetStateAction<number>>,
    all?: never,
}

interface ProfileProjectItemPropsAll extends ProfileProjectItemPropsBase {
    iter?: never,
    setIter?: never,
    all: true,
}

type ProfileProjectItemProps = ProfileProjectItemPropsFeatured | ProfileProjectItemPropsAll;

interface WeekStat {
    week: number,
    count: number,
}

function getCount(arr: {_id: number, count: number}[], week: number) {
    return arr.filter(x => x._id === week).reduce((a, b) => a + b.count, 0)
}

export default function ProfileProjectItem({project, thisUser, iter, setIter, all}: ProfileProjectItemProps) {
    const [session, loading] = useSession();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const isOwner = session && (session.userId === project.userId);

    const thisWeek = getWeek(new Date());
    const weekStats: WeekStat[] = [4, 3, 2, 1, 0].map(d => ({
        week: thisWeek - d,
        count: getCount(project.postsArr, thisWeek - d) + getCount(project.snippetsArr, thisWeek - d),
    }));
    const maxCount = Math.max(...weekStats.map(d => d.count));

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
        <div
            className="p-4 rounded-md border up-border-gray-200 hover:shadow transition cursor-pointer relative up-hover-parent"
            style={{minHeight: 120}}
        >
            <SEO title={`${thisUser.name}'s projects`}/>
            <Link href={"/@" + thisUser.username + "/" + project.urlName}>
                <a className="flex flex-col h-full">
                    <H4 className="mb-2">{project.name}</H4>
                    <p className="break-words text-gray-400 mb-4">{ellipsize(project.description, 50)}</p>
                    <div className="grid mt-auto items-center" style={{gridTemplateColumns: "24px repeat(5, 16px)"}}>
                        <FiActivity className="text-gray-400 text-sm"/>
                        {weekStats.map(weekStat => (
                            <div style={{
                                width: 12,
                                height: 12,
                                backgroundColor: weekStat.count ? "#0026ff" : "#000000",
                                opacity: weekStat.count ? (weekStat.count / maxCount / 2) : 0.05,
                                borderRadius: 7,
                            }} key={project._id + weekStat.week}/>
                        ))}
                    </div>
                </a>
            </Link>
            {isOwner && !all && (
                <>
                    <div className="up-hover-child absolute bottom-2 right-2">
                        <button
                            className="h-8 w-8 hover:shadow-lg transition rounded-full flex items-center justify-center up-gray-400 bg-white border"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <FiX/>
                        </button>
                    </div>
                    <UiModal isOpen={deleteOpen} setIsOpen={setDeleteOpen}>
                        <p>Are you sure you want to remove this project from your featured projects?</p>
                        <div className="flex mt-4">
                            <Button
                                isLoading={deleteLoading}
                                onClick={onDelete}
                            >
                                Remove
                            </Button>
                            <button className="up-button text" onClick={() => setDeleteOpen(false)}>Cancel</button>
                        </div>
                    </UiModal>
                </>
            )}
        </div>
    );
}