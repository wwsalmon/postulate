import {DatedObj} from "../utils/types";
import React, {ReactNode} from "react";
import H3 from "./style/H3";
import Link from "next/link";
import Linkify from "react-linkify";
import {UserObjWithProjects} from "../pages/[username]";

export default function ProfileShell({thisUser, children, featured, selectedProjectId}: {thisUser: DatedObj<UserObjWithProjects>, children: ReactNode, featured?: boolean, selectedProjectId?: string}) {
    const featuredProjects = thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id));

    return (
        <>
            <div className="up-bg-gray-50 w-1/2 left-0 top-0 h-full z-0 hidden lg:block fixed"/>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="lg:flex">
                    <div className="hidden lg:block lg:w-80 up-bg-gray-50 -my-8 h-full pt-12 border-r up-border-gray-200 sticky top-16" style={{minHeight: "calc(100vh - 64px)"}}>
                        <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-12 h-12 rounded-full"/>
                        <H3 className="my-4">{thisUser.name}</H3>
                        <p className="up-gray-400 mb-12"><Linkify>{thisUser.bio}</Linkify></p>
                        <Link href={`/@${thisUser.username}`}>
                            <a
                                className={(featured ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                                style={{
                                    right: -1,
                                    paddingLeft: featured ? "calc(1rem - 1px)" : 0,
                                    width: featured ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                                }}
                            >
                                Home
                            </a>
                        </Link>
                        {!featured && !featuredProjects.some(d => d._id === selectedProjectId) && ((() => {
                            const thisProject = thisUser.projectsArr.find(d => d._id === selectedProjectId);
                            return (
                                <Link href={`/@${thisUser.username}/${thisProject.urlName}`}>
                                    <a
                                        className={(thisProject._id === selectedProjectId ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                                        style={{
                                            right: -1,
                                            paddingLeft: thisProject._id === selectedProjectId ? "calc(1rem - 1px)" : 0,
                                            width: thisProject._id === selectedProjectId ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                                        }}
                                    >
                                        {thisProject.name}
                                    </a>
                                </Link>                                
                            )
                        })())}
                        {featuredProjects.map(project => (
                            <Link href={`/@${thisUser.username}/${project.urlName}`}>
                                <a
                                    className={(project._id === selectedProjectId ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                                    style={{
                                        right: -1,
                                        paddingLeft: project._id === selectedProjectId ? "calc(1rem - 1px)" : 0,
                                        width: project._id === selectedProjectId ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                                    }}
                                >
                                    {project.name}
                                </a>
                            </Link>
                        ))}
                    </div>
                    <div className="lg:pl-12 w-full bg-white h-full -my-8 pt-12" style={{minHeight: "calc(100vh - 64px)"}}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}