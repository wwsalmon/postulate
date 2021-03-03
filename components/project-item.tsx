import {DatedObj, ProjectObj, UserObj} from "../utils/types";
import Link from "next/link";

export default function ProjectItem({project, owners, sessionUserId = null}: {
    project: DatedObj<ProjectObj>,
    owners: DatedObj<UserObj>[],
    sessionUserId?: string,
}) {
    return (
        <div className="p-2 md:w-1/3">
            <Link href={`/projects/${project._id}`}>
                <a className="block p-4 shadow-md rounded-md md:h-full">
                    <h3 className="up-ui-item-title leading-tight mb-2">{project.name}</h3>
                    {(project.userId !== sessionUserId) && (
                        <div className="flex items-center my-4">
                            <img
                                src={owners.find(d => d._id === project.userId).image}
                                alt={owners.find(d => d._id === project.userId).name}
                                className="w-10 w-10 rounded-full mr-4"
                            />
                            <p>{owners.find(d => d._id === project.userId).name}</p>
                        </div>
                    )}
                    <p className="opacity-50">{project.description}</p>
                </a>
            </Link>
        </div>
    );
}