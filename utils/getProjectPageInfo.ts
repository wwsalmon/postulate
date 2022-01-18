import {GetServerSidePropsContext} from "next";
import {UserModel} from "../models/user";
import {ProjectModel} from "../models/project";

export async function getProjectPageInfo(context: GetServerSidePropsContext) {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return false;
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    const pageUser = await UserModel.findOne({username: username});

    if (!pageUser) return false;

    const pageProject = await ProjectModel.findOne({urlName: projectUrlName, userId: pageUser._id});

    if (!pageProject) return false;

    return {pageUser, pageProject};
}