import {ProjectPageProps} from "../../utils/getPublicNodeSSRFunction";
import getProjectUrl from "../../utils/getProjectUrl";
import Link from "next/link";
import LinesEllipsis from "react-lines-ellipsis";

export default function ProjectCard({pageProject, pageUser, thisUser}: ProjectPageProps) {
    return (
        <Link href={getProjectUrl(pageUser, pageProject)}>
            <a className="p-4 rounded-md border border-300">
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