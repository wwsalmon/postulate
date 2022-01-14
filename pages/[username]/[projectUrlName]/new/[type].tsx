import {GetServerSideProps, GetServerSidePropsContext} from "next";
import dbConnect from "../../../../utils/dbConnect";
import {UserModel} from "../../../../models/user";
import {ProjectModel} from "../../../../models/project";
import getThisUser from "../../../../utils/getThisUser";
import {ssr403, ssr404, ssrRedirect} from "next-response-helpers";
import {NodeModel} from "../../../../models/node";

export default function NewNodeRedirect() {
    return <></>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, projectUrlName, type} = context.params;

    console.log(username, projectUrlName, type);

    if (!["post", "evergreen", "source"].includes(type.toString())) return ssr404;

    try {
        await dbConnect();

        const pageInfo = await getProjectPageInfo(context);

        if (!pageInfo) return ssr404;

        const {pageUser, pageProject} = pageInfo;

        const thisUser = await getThisUser(context);

        if (!(thisUser && thisUser._id.toString() === pageUser._id.toString())) return ssr403;

        const slateInit = [{type: "p", children: [{text: ""}]}];

        const thisBody = (type === "source") ?
            {
                title: "New source",
                link: "",
                notes: slateInit,
                summary: slateInit,
                takeaways: slateInit,
            } :
            {
                title: `Untitled ${type}`,
                body: slateInit,
            };

        console.log(thisBody);

        const thisNode = await NodeModel.create({
            type: type,
            userId: thisUser._id,
            projectId: pageProject._id,
            body: thisBody,
        })

        console.log(thisNode);

        return ssrRedirect(`/${username}/${projectUrlName}/${thisNode._id}`);
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};

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