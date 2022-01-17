import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {NodeModel} from "../../../models/node";
import {ssr404, ssrRedirect} from "next-response-helpers";
import getLookup from "../../../utils/getLookup";
import getProjectUrl from "../../../utils/getProjectUrl";

export default function PostRedirect() {
    return <></>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {postUrlName} = context.params;

    if (Array.isArray(postUrlName)) return ssr404;

    try {
        await dbConnect();

        const pagePost = (await NodeModel.aggregate([
            {$match: {type: "post", "body.urlName": encodeURIComponent(postUrlName)}},
            {
                $lookup: {
                    from: "projects",
                    let: {projectId: "$projectId"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$_id", "$$projectId"]}}},
                        getLookup("users", "_id", "userId", "userArr"),
                    ],
                    as: "projectArr"
                }
            },
        ]))[0];

        const pageProject = pagePost && pagePost.projectArr[0];

        const pageUser = pageProject && pageProject.userArr[0];

        if (!(pagePost && pageProject && pageUser)) return ssr404;

        return ssrRedirect(`${getProjectUrl(pageUser, pageProject)}/p/${pagePost.body.urlName}`);
    } catch (e) {
        console.log(e);

        return ssr404;
    }
}