import {DatedObj, NodeTypes, ProjectObj, UserObj} from "./types";
import {GetServerSideProps} from "next";
import dbConnect from "./dbConnect";
import {NodeModel} from "../models/node";
import getThisUser from "./getThisUser";
import {cleanForJSON} from "./utils";
import {ssr404} from "next-response-helpers";
import {NodeWithShortcut} from "../components/project/MainShell";
import {ShortcutModel} from "../models/shortcut";
import getLookup from "./getLookup";
import {getProjectPageInfo} from "./getProjectPageInfo";
import {NotificationModel} from "../models/notification";

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

        // @ts-ignore
        let pageNode: any = await NodeModel.findOne({
            type: nodeType,
            "body.urlName": encodeURIComponent(urlName.toString()),
            projectId: pageProject._id,
        });

        if (!pageNode) {
            const pageShortcut = await ShortcutModel.aggregate([
                {$match: {type: nodeType, projectId: pageProject._id, urlName: encodeURIComponent(urlName.toString())}},
                {
                    $lookup: {
                        from: "nodes",
                        let: {"targetId": "$targetId"},
                        pipeline: [
                            {$match: {$expr: {$eq: ["$_id", "$$targetId"]}}},
                            getLookup("projects", "_id", "projectId", "orrProjectArr"),
                        ],
                        as: "nodeArr",
                    }
                },
            ]);

            if (!pageShortcut.length) return ssr404;

            let shortcutOnly = {...pageShortcut[0]};
            delete shortcutOnly.nodeArr;

            pageNode = {
                ...pageShortcut[0].nodeArr[0],
                shortcutArr: [shortcutOnly],
            };
        } else {
            pageNode = pageNode.toObject();
        }

        const thisUser = await getThisUser(context);
if (thisUser && thisUser.redirect) return thisUser.redirect;

        let newPageNode = {...pageNode};

        if (!thisUser || (thisUser._id.toString() !== pageProject.userId.toString())) {
            delete newPageNode.body.title;
            delete newPageNode.body.body;
        }

        if (thisUser) {
            await NotificationModel.updateMany({nodeId: pageNode._id}, {read: true});
        }

        return {props: cleanForJSON({pageUser, pageProject, pageNode: newPageNode, thisUser})};
    } catch (e) {
        console.log(e);
        return ssr404;
    }
}

export default getPublicNodeSSRFunction;