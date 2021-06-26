import React from "react";
import {DatedObj} from "../../utils/types";
import {UserObjWithProjects} from "../../pages/[username]/index";
import H1 from "../style/H1";
import H4 from "../style/H4";
import Link from "next/link";
import H3 from "../style/H3";
import H2 from "../style/H2";

export default function ProfileFeatured({thisUser}: { thisUser: DatedObj<UserObjWithProjects> }) {
    const featuredProjects = thisUser.projectsArr.filter(d => thisUser.featuredProjects.includes(d._id));

    return (
        <>
            <H1>Welcome to {thisUser.name.split(" ")[0]}'s Postulate</H1>
            <H2 className="mt-2">Repositories of open-sourced knowledge</H2>
            <H4 className="mt-12 mb-8">Featured repositories</H4>
            <div className="grid grid-cols-4 gap-4">
                {featuredProjects.map(project => (
                    <div className="p-4 shadow-sm rounded-md border hover:shadow-md transition cursor-pointer">
                        <Link href={"/@" + thisUser.username + "/" + project.urlName}>
                            <a>
                                <H3 className="mb-2">{project.name}</H3>
                                <p className="break-words up-gray-400">{project.description}</p>
                            </a>
                        </Link>
                    </div>
                ))}
            </div>
            <hr className="my-16"/>
            <H4 className="mb-8">Featured posts</H4>
        </>
    );
}