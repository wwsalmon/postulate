import {DatedObj, UserObjWithProjects} from "../utils/types";
import React, {ReactNode, useState} from "react";
import H3 from "./style/H3";
import Link from "next/link";
import Linkify from "react-linkify";
import ProfileSidebarProjectItem from "./ProfileSidebarProjectItem";
import {FiMenu, FiX} from "react-icons/fi";
import UpInlineButton from "./style/UpInlineButton";

export default function ProfileShell({thisUser, children, featured, selectedProjectId}: {thisUser: DatedObj<UserObjWithProjects>, children: ReactNode, featured?: boolean, selectedProjectId?: string}) {
    const featuredProjects = thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id));
    const thisProject = selectedProjectId && thisUser.projectsArr.find(d => d._id === selectedProjectId);

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const SidebarContents = (props: {mobile?: boolean}) => (
        <div className={`overflow-y-auto -mx-4 px-4 ${props.mobile ? "" : "pt-12"}`} style={{
            height: props.mobile ? "calc(100vh - 4rem - 64px)" : "calc(100vh - 4rem)"
        }}>
            <Link href={`/@${thisUser.username}`}>
                <a>
                    <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-12 h-12 rounded-full"/>
                    <H3 className="my-4">{thisUser.name}</H3>
                </a>
            </Link>
            <p className="up-gray-400 mb-12 underline-links"><Linkify>{thisUser.bio}</Linkify></p>
            <ProfileSidebarProjectItem name="Home" href={`/@${thisUser.username}`} selected={featured} mobile={!!props.mobile}/>
            {!featured && !featuredProjects.some(d => d._id === selectedProjectId) && ((() => {
                const thisProject = thisUser.projectsArr.find(d => d._id === selectedProjectId);
                return (
                    <ProfileSidebarProjectItem
                        name={thisProject.name}
                        href={`/@${thisUser.username}/${thisProject.urlName}`}
                        mobile={!!props.mobile}
                        selected={thisProject._id === selectedProjectId}
                    />
                )
            })())}
            {featuredProjects.map(project => (
                <ProfileSidebarProjectItem
                    name={project.name}
                    href={`/@${thisUser.username}/${project.urlName}`}
                    mobile={!!props.mobile}
                    selected={project._id === selectedProjectId}
                />
            ))}
            <hr className="my-4 invisible"/>
        </div>
    )

    return (
        <>
            <div className="up-bg-gray-50 w-1/2 left-0 top-0 h-full z-0 hidden lg:block fixed"/>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="lg:flex">
                    <div
                        className="lg:hidden h-12 up-bg-gray-50 -mt-8 -mx-4 px-4 border-b up-border-gray-200 flex items-center sticky top-12 sm:top-16 z-20"
                    >
                        <button onClick={() => setDrawerOpen(true)}>
                            <FiMenu/>
                        </button>
                        <UpInlineButton href={`/@${thisUser.username}`} className="flex items-center ml-4">
                            <img src={thisUser.image} alt={`Profile picture of ${thisUser.name}`} className="w-6 h-6 rounded-full"/>
                            <p className="ml-2">{thisUser.name}</p>
                        </UpInlineButton>
                        {!featured && selectedProjectId && (
                            <>
                                <span className="mx-2 up-gray-300">/</span>
                                <UpInlineButton href={`/@${thisUser.username}/${thisProject.urlName}`} light={true}>
                                    {thisProject.name}
                                </UpInlineButton>
                            </>
                        )}
                    </div>
                    <div
                        className={`lg:hidden fixed top-12 sm:top-16 ${drawerOpen ? "left-0" : "-left-64"} w-64 up-bg-gray-50 px-4 border-r up-border-gray-200 z-20`}
                        style={{
                            height: "calc(100vh - 3rem)",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <div className="h-12 flex items-center mb-4">
                            <button onClick={() => setDrawerOpen(false)}>
                                <FiX/>
                            </button>
                        </div>
                        <SidebarContents mobile={true}/>
                    </div>
                    <div className="hidden lg:block lg:w-80 up-bg-gray-50 -my-8 h-full pl-2 border-r up-border-gray-200 sticky top-16" style={{minHeight: "calc(100vh - 64px)"}}>
                        <SidebarContents/>
                    </div>
                    <div className="lg:pl-12 w-full bg-white h-full lg:-my-8 pt-12" style={{minHeight: "calc(100vh - 64px)"}}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}