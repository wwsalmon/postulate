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
import slateWordCount from "../../../slate/slateWordCount";
import UiH3 from "../../../components/style/UiH3";
import {FiArrowLeft, FiMoreVertical} from "react-icons/fi";
import InlineButton from "../../../components/style/InlineButton";
import UiButton from "../../../components/style/UiButton";
import {MoreMenu, MoreMenuItem} from "../../../components/headless/MoreMenu";
import UiModal from "../../../components/style/UiModal";
import {useRouter} from "next/router";
import ConfirmModal from "../../../components/standard/ConfirmModal";

export default function NodePage({pageProject, pageNode, pageUser, thisUser}: {pageProject: DatedObj<ProjectObj>, pageNode: DatedObj<NodeObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>}) {
    const router = useRouter();

    const isOwner = thisUser && thisUser._id === pageUser._id;
    const nodeType = pageNode.type;

    const [thisNode, setThisNode] = useState<DatedObj<NodeObj>>(pageNode);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
    const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);

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

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete(`/api/node`, {data: {id: pageNode._id}}).then(() => {
            router.push(`/@${pageUser.username}/${pageProject.urlName}/${pageNode.type}s`);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    function onPublish() {
        setIsPublishLoading(true);

        let newBody = {...thisNode.body};
        newBody.publishedBody = thisNode.body.body;
        newBody.publishedTitle = thisNode.body.title;
        newBody.lastPublishedDate = new Date();

        axios.post("/api/node", {
            id: pageNode._id,
            body: newBody,
        }).then(res => {
            router.push(`/@${pageUser.username}/${pageProject.urlName}/p/${res.data.node.body.urlName}`);
        }).catch(e => {
            setIsPublishLoading(false);
            console.log(e);
        });
    }

    const wordCountAndTime = `${slateWordCount(thisNode.body.body)} words / ${Math.ceil(slateWordCount(thisNode.body.body) / 200)} min read`;

    return (
        <Container>
            <SEO title={thisNode.body.title || `Untitled ${thisNode.type}`}/>
            <div className="pt-8 pb-32 mx-auto" style={{maxWidth: "78ch"}}> {/* 78ch bc font size is 16 here but we want 65ch for font size 20 */}
                <UiH3 className="mb-8">Editing {nodeType}</UiH3>
                <ClickableField
                    onSubmitEdit={onSubmitTitle}
                    prevValue={thisNode.body.title}
                    placeholder={`Untitled ${thisNode.type}`}
                    className="text-3xl font-bold font-manrope py-1 px-2 -ml-2 rounded-md"
                    inputClassName="w-full focus:outline-none leading-none"
                />
                <p className="my-4 text-gray-400 font-medium font-manrope">{wordCountAndTime}</p>
                <AutosavingEditor prevValue={thisNode.body.body} onSubmitEdit={onSubmitBody}/>
            </div>
            <div className="fixed w-full h-16 left-0 bottom-0 bg-white border-t border-gray-300 px-4 flex items-center">
                <InlineButton href={`/@${pageUser.username}/${pageProject.urlName}/${nodeType}s`} flex={true}>
                    <FiArrowLeft/>
                    <span className="ml-2">{pageProject.name}</span>
                </InlineButton>
                <MoreMenu button={<button className="hover:bg-gray-100 p-2 rounded-md"><FiMoreVertical/></button>} className="ml-auto mr-4">
                    <MoreMenuItem onClick={() => setIsDeleteOpen(true)}>Delete</MoreMenuItem>
                    <MoreMenuItem>Unpublish</MoreMenuItem>
                </MoreMenu>
                <UiButton onClick={() => setIsPublishOpen(true)}>
                    Publish
                </UiButton>
                <ConfirmModal
                    isOpen={isDeleteOpen}
                    setIsOpen={setIsDeleteOpen}
                    isLoading={isDeleteLoading}
                    setIsLoading={setIsDeleteLoading}
                    onConfirm={onDelete}
                    confirmText="Delete"
                >
                    Are you sure you want to delete this post? This action is irreversible.
                </ConfirmModal>
                <ConfirmModal
                    isOpen={isPublishOpen}
                    setIsOpen={setIsPublishOpen}
                    isLoading={isPublishLoading}
                    setIsLoading={setIsPublishLoading}
                    onConfirm={onPublish}
                    confirmText="Publish"
                >
                    Are you sure you want to publish this post? This will make the latest contents publicly viewable.
                </ConfirmModal>
            </div>
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