import {ProjectPageProps} from "../../utils/getPublicNodeSSRFunction";
import getProjectUrl from "../../utils/getProjectUrl";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";
import {Dispatch, SetStateAction, useState} from "react";
import {FiTrash} from "react-icons/fi";
import ConfirmModal from "../standard/ConfirmModal";
import axios from "axios";

export default function ProjectCard({pageProject, pageUser, className}: ProjectPageProps & {className?: string}) {
    return (
        <Link href={getProjectUrl(pageUser, pageProject)}>
            <a className={`p-4 rounded-md border border-300 block hover:bg-gray-50 transition ${className || ""}`}>
                <h3 className="font-manrope font-bold leading-snug">{pageProject.name}</h3>
                <LinesEllipsis
                    text={pageProject.description || ""}
                    maxLine={3}
                    className="text-gray-400 text-sm leading-relaxed my-2 text-ellipsis overflow-hidden"
                />
            </a>
        </Link>
    );
}

export function ProjectCardFeatured({iter, setIter, ...props}: ProjectPageProps & {iter: number, setIter: Dispatch<SetStateAction<number>>}) {
    const {pageProject} = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onRemove() {
        setIsLoading(true);

        axios.delete("/api/project/feature", {data: {
            id: pageProject._id,
        }}).then(() => {
            setIter(iter + 1);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        });
    }

    return (
        <div className="relative">
            <ProjectCard {...props} className="h-full"/>
            <button
                className="absolute bottom-2 right-2 rounded-full p-2 border border-gray-300 bg-white hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
                onClick={() => setIsOpen(true)}
            >
                <FiTrash/>
            </button>
            <ConfirmModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onConfirm={onRemove}
                confirmText="Remove"
                colorClass="bg-red-500 hover:bg-red-700"
            >
                Are you sure you want to remove <b>{pageProject.name}</b> from your featured projects?
            </ConfirmModal>
        </div>
    )
}