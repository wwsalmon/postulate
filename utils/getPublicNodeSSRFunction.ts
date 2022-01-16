import {DatedObj, NodeTypes, ProjectObj, UserObj} from "./types";
import {GetServerSideProps} from "next";
import dbConnect from "./dbConnect";
import {getProjectPageInfo} from "../pages/[username]/[projectUrlName]/new/[type]";
import {NodeModel} from "../models/node";
import getThisUser from "./getThisUser";
import {cleanForJSON} from "./utils";
import {ssr404} from "next-response-helpers";
import {NodeWithShortcut} from "../components/project/MainShell";

export interface ProjectPageProps {
    pageUser: DatedObj<UserObj>,
    pageProject: DatedObj<ProjectObj>,
    thisUser: DatedObj<UserObj>,
}

export type PublicNodePageProps = ProjectPageProps & {pageNode: DatedObj<NodeWithShortcut>};

const getPublicNodeSSRFunction: (nodeType: NodeTypes) => GetServerSideProps = (nodeType) => async (context) => {
    const {urlName} = context.params;

    try {
        await dbConnect();

        const pageInfo = await getProjectPageInfo(context);

        if (!pageInfo) return ssr404;

        const {pageUser, pageProject} = pageInfo;

        const pageNode = await NodeModel.findOne({
            type: nodeType,
            "body.urlName": encodeURIComponent(urlName.toString()),
            projectId: pageProject._id,
        });

        if (!pageNode) return ssr404;

        const thisUser = await getThisUser(context);

        let newPageNode = {...pageNode.toObject()};

        if (!thisUser || (thisUser._id.toString() !== pageProject.userId.toString())) {
            delete newPageNode.body.title;
            delete newPageNode.body.body;
        }

        return {props: cleanForJSON({pageUser, pageProject, pageNode: newPageNode, thisUser})};
    } catch (e) {
        console.log(e);
        return ssr404;
    }
}

export default getPublicNodeSSRFunction;