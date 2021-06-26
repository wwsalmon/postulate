import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {ProjectModel} from "../../models/project";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj} from "../../utils/types";
import {UserObjWithProjects} from "./index";
import ProfileShell from "../../components/ProfileShell";
import UpInlineButton from "../../components/style/UpInlineButton";
import React from "react";
import H1 from "../../components/style/H1";
import H4 from "../../components/style/H4";
import ProfileProjectItem from "../../components/ProfileProjectItem";

export default function Projects({thisUser}: { thisUser: DatedObj<UserObjWithProjects> }) {
    return (
        <ProfileShell thisUser={thisUser} featured={true}>
            <div className="flex items-center mb-8">
                <UpInlineButton href={`/@${thisUser.username}`} light={true}>
                    {thisUser.name}
                </UpInlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <H1>All projects</H1>
            <div className="grid grid-cols-4 gap-4 my-12">
                {thisUser.projectsArr.map(project => (
                    <ProfileProjectItem
                        project={project}
                        thisUser={thisUser}
                        all={true}
                    />
                ))}
            </div>
        </ProfileShell>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);

    try {
        await dbConnect();

        const userObj = await UserModel.aggregate([
            {$match: {username: username}},
            {$lookup:
                    {
                        from: "projects",
                        foreignField: "userId",
                        localField: "_id",
                        as: "projectsArr",
                    }
            },
        ]);

        if (!userObj.length) return { notFound: true };

        return { props: { thisUser: cleanForJSON(userObj[0]), key: username }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}