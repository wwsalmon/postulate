import {GetServerSideProps} from "next";
import dbConnect from "../../utils/dbConnect";
import {UserModel} from "../../models/user";
import {cleanForJSON} from "../../utils/utils";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import {useState} from "react";
import ProfileProject from "../../components/profile/ProfileProject";

export interface UserObjWithProjects extends UserObj {
    projectsArr: DatedObj<ProjectObj>[],
}

export default function UserProfile({thisUser}: { thisUser: DatedObj<UserObjWithProjects> }) {
    return (
        <ProfileProject thisUser={thisUser} featured={true}/>
    )
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