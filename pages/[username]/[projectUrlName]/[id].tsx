import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import getThisUser from "../../../utils/getThisUser";
import {cleanForJSON} from "../../../utils/utils";
import {ssr404} from "next-response-helpers";
import mongoose from "mongoose";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import {useState} from "react";
import SEO from "../../../components/standard/SEO";
import ClickableAutosavingField from "../../../components/standard/ClickableAutosavingField";
import axios from "axios";
import AutosavingEditor from "../../../components/standard/AutosavingEditor";
import slateWordCount from "../../../slate/slateWordCount";
import UiH3 from "../../../components/style/UiH3";
import {FiArrowLeft} from "react-icons/fi";
import InlineButton from "../../../components/style/InlineButton";
import UiButton from "../../../components/style/UiButton";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../../../components/headless/MoreMenu";
import {useRouter} from "next/router";
import ConfirmModal from "../../../components/standard/ConfirmModal";
import getProjectUrl from "../../../utils/getProjectUrl";
import AutosavingField from "../../../components/standard/AutosavingField";

export const getIsNodeUpdated = (node: NodeObj): boolean => {
    if (!("publishedTitle" in node.body)) return false;
    const fields = node.type === "source" ? ["title", "link", "notes", "summary", "takeaways"] : ["title", "body"];

    const areFieldsUpdated = fields.every(d =>
        JSON.stringify(node.body[d])
        === JSON.stringify(node.body[`published${d.charAt(0).toUpperCase()}${d.substring(1)}`])
    );

    return areFieldsUpdated;
}

export default function NodePage({pageProject, pageNode, pageUser, thisUser}: {pageProject: DatedObj<ProjectObj>, pageNode: DatedObj<NodeObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>}) {
    const router = useRouter();

    const nodeType = pageNode.type;
    const isEvergreen = nodeType === "evergreen";
    const isSource = nodeType === "source";

    const [thisNode, setThisNode] = useState<DatedObj<NodeObj>>(pageNode);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
    const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);

    const [saveStatus, setSaveStatus] = useState<string>("");
    const isNodePublished = "publishedTitle" in thisNode.body;
    const isNodeUpdated = getIsNodeUpdated(thisNode);

    async function submitAndUpdate(data: any) {
        try {
            const {data: {node: newNode}} = await axios.post("/api/node", {
                id: thisNode._id,
                ...data,
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
            router.push(`${getProjectUrl(pageUser, pageProject)}/${pageNode.type}s`);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    function onPublish() {
        setIsPublishLoading(true);

        let data: any = {
            id: pageNode._id,
            publishedTitle: thisNode.body.title,
            lastPublishedDate: new Date(),
        };

        data = (thisNode.type === "source") ? {
            ...data,
            publishedLink: thisNode.body.link,
            publishedNotes: thisNode.body.notes,
            publishedSummary: thisNode.body.summary,
            publishedTakeaways: thisNode.body.takeaways,
        } : {
            ...data,
            publishedBody: thisNode.body.body,
        };

        axios.post("/api/node", data).then(res => {
            router.push(`${getProjectUrl(pageUser, pageProject)}/${isSource ? "s" : isEvergreen ? "e" : "p"}/${res.data.node.body.urlName}`);
        }).catch(e => {
            setIsPublishLoading(false);
            console.log(e);
        });
    }

    const wordCountAndTime = (thisNode.type === "post") && `${slateWordCount(thisNode.body.body)} words / ${Math.ceil(slateWordCount(thisNode.body.body) / 200)} min read`;

    const ActionBar = () => (
        <div className={`h-16 border-t border-gray-300 px-4 flex items-center ${isEvergreen ? "-mx-8 mt-8" : "fixed left-0 bottom-0 bg-white w-full"}`}>
            <InlineButton href={`${getProjectUrl(pageUser, pageProject)}/${nodeType}s`} flex={true}>
                <FiArrowLeft/>
                <span className="ml-2">{pageProject.name}</span>
            </InlineButton>
            <span className="ml-auto mr-4">{saveStatus === "Saved" ? isNodeUpdated ? "Up to date" :  "Draft saved" : saveStatus}</span>
            <MoreMenu button={<MoreMenuButton/>} className="mr-4">
                <MoreMenuItem onClick={() => setIsDeleteOpen(true)}>Delete</MoreMenuItem>
                {("publishedTitle" in thisNode.body) && (
                    <>
                        <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${isSource ? "s" : isEvergreen ? "e" : "p"}/${thisNode.body.urlName}`}>
                            View as public
                        </MoreMenuItem>
                        <MoreMenuItem>Unpublish</MoreMenuItem>
                    </>
                )}
            </MoreMenu>
            <UiButton onClick={() => setIsPublishOpen(true)} disabled={isNodeUpdated}>
                {isNodePublished ? "Update" : "Publish"}
            </UiButton>
            <ConfirmModal
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                isLoading={isDeleteLoading}
                setIsLoading={setIsDeleteLoading}
                onConfirm={onDelete}
                confirmText="Delete"
            >
                Are you sure you want to delete this {nodeType}? This will delete all shortcuts to this {nodeType} as well. This action is irreversible.
            </ConfirmModal>
            <ConfirmModal
                isOpen={isPublishOpen}
                setIsOpen={setIsPublishOpen}
                isLoading={isPublishLoading}
                setIsLoading={setIsPublishLoading}
                onConfirm={onPublish}
                confirmText={isNodePublished ? "Update" : "Publish"}
            >
                Are you sure you want to {isNodePublished ? "update the public version of" : "publish"} this {nodeType}? This will make the latest contents publicly viewable.
            </ConfirmModal>
        </div>
    );

    return (
        <>
            <SEO title={thisNode.body.title || `Untitled ${thisNode.type}`}/>
            {(thisNode.type === "source") ? (
                <div className="lg:flex max-w-7xl mx-auto pb-32 px-4">
                    <div className="flex-grow lg:border-r border-gray-300 lg:pr-8 mx-auto" style={{maxWidth: "76ch"}}>
                        <UiH3 className="mb-4">Source name</UiH3>
                        <ClickableAutosavingField
                            prevValue={thisNode.body.title}
                            onSubmitEdit={(title) => submitAndUpdate({title})}
                            setStatus={setSaveStatus}
                            className="text-2xl font-bold font-manrope focus:outline-none w-full"
                        />
                        <UiH3 className="mt-12 mb-2">Source link</UiH3>
                        <AutosavingField
                            prevValue={thisNode.body.link}
                            onSubmitEdit={(link) => submitAndUpdate({link})}
                            setStatus={setSaveStatus}
                            placeholder="ex. https://www.goodreads.com/book/show/125441.An_Autobiography"
                            className="w-full focus:outline-none text-gray-500"
                        />
                        <UiH3 className="mt-12 mb-2">Summary</UiH3>
                        <AutosavingEditor
                            prevValue={thisNode.body.summary}
                            onSubmitEdit={(summary) => submitAndUpdate({summary})}
                            setStatus={setSaveStatus}
                            fontSize={18}
                        />
                        <UiH3 className="mt-12 mb-2">Takeaways</UiH3>
                        <AutosavingEditor
                            prevValue={thisNode.body.takeaways}
                            onSubmitEdit={(takeaways) => submitAndUpdate({takeaways})}
                            setStatus={setSaveStatus}
                            fontSize={18}
                        />
                    </div>
                    <div className="flex-grow w-full lg:pl-12 mx-auto" style={{maxWidth: "76ch"}}>
                        <UiH3 className="mb-2 mt-12 lg:mt-0">Notes</UiH3>
                        <AutosavingEditor
                            prevValue={thisNode.body.notes}
                            onSubmitEdit={(notes) => submitAndUpdate({notes})}
                            setStatus={setSaveStatus}
                            fontSize={18}
                        />
                    </div>
                    <ActionBar/>
                </div>
            ) : (
                <div
                    className={`mx-auto pt-8 ${isEvergreen ? "bg-white border border-gray-300 rounded-md px-8 mb-8" : "pb-32"}`}
                    style={{maxWidth: "78ch"}} // 78ch bc font size is 16 here but we want 65ch for font size 20
                >
                    <UiH3 className="mb-8">Editing {nodeType}</UiH3>
                    <ClickableAutosavingField
                        onSubmitEdit={(title) => submitAndUpdate({title})}
                        prevValue={thisNode.body.title}
                        placeholder={`Untitled ${thisNode.type}`}
                        className={`font-bold font-manrope leading-snug py-1 px-2 -ml-2 rounded-md ${isEvergreen ? "text-2xl" : "text-3xl"}`}
                        inputClassName="w-full focus:outline-none leading-none"
                        setStatus={setSaveStatus}
                    />
                    {!isEvergreen && (
                        <p className="my-4 text-gray-400 font-medium font-manrope">{wordCountAndTime}</p>
                    )}
                    <AutosavingEditor
                        prevValue={thisNode.body.body}
                        onSubmitEdit={(body) => submitAndUpdate({body})}
                        setStatus={setSaveStatus}
                    />
                    <ActionBar/>
                </div>
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        Array.isArray(context.params.id) ||
        context.params.username.substr(0, 1) !== "@"
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

        const thisUser = await getThisUser(context);

        if (!thisUser) return ssr404;

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

        delete pageUser.projectArr;
        delete pageProject.nodeArr;

        return {
            props: {
                pageNode: cleanForJSON(pageNode),
                pageProject: cleanForJSON(pageProject),
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                key: id,
            }
        };
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};