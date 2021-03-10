import {DatedObj, ProjectObj, ProjectObjWithCounts, UserObj} from "../utils/types";
import Link from "next/link";
import {FiEdit, FiMessageSquare} from "react-icons/fi";

export default function ProjectItem({project, owners, sessionUserId = null, isProjects = false}: {
    project: DatedObj<ProjectObjWithCounts>,
    owners: DatedObj<UserObj>[],
    sessionUserId?: string,
    isProjects?: boolean,
}) {
    const numPosts = project.posts.length ? project.posts[0].count : 0;
    const numSnippets = project.snippets.length ? project.snippets[0].count : 0;
    const numLinkedSnippets = project.linkedSnippets.length ? project.linkedSnippets[0].count : 0;
    const percentLinked = numLinkedSnippets ? Math.round(numLinkedSnippets / numSnippets * 100) : 0;

    return (
        <div className="p-2 md:w-1/3">
            <Link href={isProjects ? `/projects/${project._id}` : `/@${owners.find(d => d._id === project.userId).username}/${project.urlName}`}>
                <a className="block p-4 shadow-md rounded-md md:h-full relative pb-12 up-hover-parent">
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
                    <div className="flex items-center py-4 absolute bottom-0 w-full">
                        <p className="opacity-25 hover:opacity-75 transition mr-6">
                            {percentLinked}%
                        </p>
                        <div className="up-hover-child">
                            <div className="flex items-center opacity-25 hover:opacity-75 mr-6 transition">
                                <p className="mr-2">{numPosts}</p>
                                <FiEdit/>
                            </div>
                        </div>
                        {isProjects && (
                            <div className="up-hover-child">
                                <div className="flex items-center opacity-25 hover:opacity-75 mr-6 transition">
                                    <p className="mr-2">{numSnippets}</p>
                                    <FiMessageSquare/>
                                </div>
                            </div>
                        )}
                    </div>
                </a>
            </Link>
        </div>
    );
}