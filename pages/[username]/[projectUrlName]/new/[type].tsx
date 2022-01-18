import {GetServerSideProps} from "next";
import dbConnect from "../../../../utils/dbConnect";
import getThisUser from "../../../../utils/getThisUser";
import {ssr403, ssr404, ssrRedirect} from "next-response-helpers";
import {NodeModel} from "../../../../models/node";
import {getProjectPageInfo} from "../../../../utils/getProjectPageInfo";

export default function NewNodeRedirect() {
    return <p>testing</p>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {username, projectUrlName, type} = context.params;

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

        const thisNode = await NodeModel.create({
            type: type,
            userId: thisUser._id,
            projectId: pageProject._id,
            body: thisBody,
        })

        return ssrRedirect(`/${username}/${projectUrlName}/${thisNode._id}`);
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};