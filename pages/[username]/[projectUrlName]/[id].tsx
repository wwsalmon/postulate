import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import getThisUser from "../../../utils/getThisUser";
import {cleanForJSON} from "../../../utils/utils";
import {ssr404} from "next-response-helpers";
import mongoose from "mongoose";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import Container from "../../../components/style/Container";
import {useState} from "react";
import SEO from "../../../components/standard/SEO";
import {Node} from "slate";
import ClickableField from "../../../components/headless/ClickableField";
import axios from "axios";
import AutosavingEditor from "../../../components/headless/AutosavingEditor";

export default function NodePage({pageProject, pageNode, pageUser, thisUser}: {pageProject: DatedObj<ProjectObj>, pageNode: DatedObj<NodeObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>}) {
    const isOwner = thisUser && thisUser._id === pageUser._id;

    const [thisNode, setThisNode] = useState<DatedObj<NodeObj>>(pageNode);

    async function onSubmitTitle(title: string) {
        let newBody = {...thisNode.body};
        newBody.title = title;
        await submitAndUpdate(newBody);
        return;
    }

    async function onSubmitBody(body: Node[]) {
        let newBody = {...thisNode.body};
        newBody.body = body;
        await submitAndUpdate(newBody);
        return;
    }

    async function submitAndUpdate(newBody: any) {
        try {
            const {data: {node: newNode}} = await axios.post("/api/node", {
                id: thisNode._id,
                body: newBody,
            });

            setThisNode(newNode);

            return;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    return (
        <Container>
            <SEO title={thisNode.body.title || `Untitled ${thisNode.type}`}/>
            <ClickableField onSubmitEdit={onSubmitTitle} prevValue={thisNode.body.title} placeholder={`Untitled ${thisNode.type}`}/>
            <AutosavingEditor prevValue={thisNode.body.body} onSubmitEdit={onSubmitBody}/>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        Array.isArray(context.params.id) ||
        context.params.username.substr(0, 1) !== "@" ||
        !mongoose.Types.ObjectId.isValid(context.params.id)
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;
    const id: string = context.params.id;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const graphQuery = await UserModel.aggregate([
            {$match: {username: username}},
            {
                $lookup: {
                    from: "projects",
                    let: {userId: "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {$expr: {$eq: ["$userId", "$$userId"]}},
                                    {urlName: projectUrlName},
                                ],
                            },
                        },
                        {
                            $lookup: {
                                from: "nodes",
                                let: {projectId: "$_id"},
                                pipeline: [
                                    {
                                        $match: {
                                            $and: [
                                                {$expr: {$eq: ["$projectId", "$$projectId"]}},
                                                {_id: mongoose.Types.ObjectId(id)},
                                            ]
                                        },
                                    },
                                ],
                                as: "nodeArr",
                            }
                        }
                    ],
                    as: "projectArr",
                }
            }
        ]);

        let pageUser = graphQuery.length ? graphQuery[0] : null;
        if (!pageUser) return ssr404;

        let pageProject = pageUser.projectArr.length ? pageUser.projectArr[0] : null;
        if (!pageProject) return ssr404;

        const pageNode = pageProject.nodeArr.length ? pageProject.nodeArr[0] : null;
        if (!pageNode) return ssr404;

        const thisUser = await getThisUser(context);

        delete pageUser.projectArr;
        delete pageProject.nodeArr;

        return {
            props: {
                pageNode: cleanForJSON(pageNode),
                pageProject: cleanForJSON(pageProject),
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                key: projectUrlName,
            }
        };
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};