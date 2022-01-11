import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {cleanForJSON, findImages} from "../../../utils/utils";
import {DatedObj, LinkObj, PostObj, ProjectObjWithOwnerWithProjects, UserObj} from "../../../utils/types";
import SEO from "../../../components/standard/SEO";
import React, {useContext, useEffect, useState} from "react";
import InlineButton from "../../../components/style/InlineButton";
import {format} from "date-fns";
import readingTime from "reading-time";
import {useSession} from "next-auth/client";
import axios from "axios";
import {useRouter} from "next/router";
import {NotifsContext} from "../../_app";
import Container from "../../../components/style/Container";

export default function PostPage({postData, linkedSnippets, thisProjects, thisAuthor, thisLinks}: {
    postData: DatedObj<PostObj>,
    linkedSnippets: string[],
    thisProjects: DatedObj<ProjectObjWithOwnerWithProjects>[],
    thisAuthor: DatedObj<UserObj>,
    thisLinks: DatedObj<LinkObj>[],
}) {
    const [session, loading] = useSession();
    const router = useRouter();
    const {notifsIteration, setNotifsIteration} = useContext(NotifsContext);

    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const isOwner = session && (session.userId === thisAuthor._id);
    const thisOwner = thisProjects[0].ownerArr[0];

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete("/api/post", {
            data: {
                postId: postData._id,
                tempId: postData.urlName,
            }
        }).then(() => {
            router.push(`/@${thisOwner.username}/${thisProjects[0].urlName}`);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    useEffect(() => {
        if (router.query.notif) {
            axios.post("/api/notification", {
                id: router.query.notif,
            }).then(() => {
                setNotifsIteration(notifsIteration + 1);
            }).catch(e => {
                console.log(e);
            })
        }
    }, [router.query]);

    return (
        <Container>
            <SEO
                title={postData.title}
                description={postData.body.substr(0, 200)}
                projectName={thisProjects[0].name}
                imgUrl={findImages(postData.slateBody).length ?  findImages(postData.slateBody)[0] : null}
                authorUsername={thisAuthor.username}
                publishedDate={postData.createdAt}
                noindex={postData.privacy !== "public"}
            />
            <div className="max-w-3xl">
                <div className="items-center mb-8 hidden lg:flex">
                    <InlineButton href={`/@${thisOwner.username}`} light={true}>
                        {thisOwner.name}
                    </InlineButton>
                    <span className="mx-3 up-gray-300">/</span>
                    {thisProjects.map((project, i) => (
                        <div className="flex items-center">
                            {i !== 0 && (
                                <span className="mr-3 up-gray-300">and</span>
                            )}
                            <InlineButton href={`/@${thisOwner.username}/${project.urlName}`} light={true}>
                                {project.name}
                            </InlineButton>
                        </div>
                    ))}
                    <span className="mx-3 up-gray-300"> / </span>
                </div>
                <div className="flex">
                    <h1 className="text-4xl font-medium up-font-display">{postData.title}</h1>
                </div>
                <div className="flex items-center mt-4 border-b pb-8">
                    <p className="up-gray-400">
                        {
                            format(new Date(postData.createdAt), "MMMM d, yyyy")
                        } | {
                            readingTime(postData.body).text
                        }{
                            !!linkedSnippets.length && (
                                <span> | {linkedSnippets.length} linked snippet{linkedSnippets.length === 1 ? "" : "s"}</span>
                            )
                        }
                    </p>
                </div>
            </div>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.postUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const postUrlName: string = context.params.postUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const graphObj = await UserModel.aggregate([
            {$match: { "username": username }},
            {
                $lookup: {
                    from: "posts",
                    let: {"userId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$and: [{$eq: ["$userId", "$$userId"]}, {$eq: ["$urlName", encodeURIComponent(postUrlName)]}]}}},
                        {
                            $lookup: {
                                from: "projects",
                                let: {"projectIds": "$projectIds"},
                                pipeline: [
                                    {$match: {$expr: {$in: ["$_id", "$$projectIds"]}}},
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: {"userId": "$userId"},
                                            pipeline: [
                                                {$match: {$expr: {$eq: ["$_id", "$$userId"]}}},
                                                {$lookup:
                                                        {
                                                            from: "projects",
                                                            foreignField: "userId",
                                                            localField: "_id",
                                                            as: "projectsArr",
                                                        }
                                                },
                                            ],
                                            as: "ownerArr",
                                        }
                                    },
                                ],
                                as: "projectArr",
                            },
                        },
                        {
                            $lookup: {
                                from: "snippets",
                                let: {"postId": "$_id"},
                                pipeline: [
                                    {$unwind: "$linkedPosts"},
                                    {$match: {$expr: {$eq: ["$linkedPosts", "$$postId"]}}},
                                    {$project: {"_id": 1}},
                                ],
                                as: "linkedSnippetsArr",
                            }
                        },
                        {
                            $lookup: {
                                from: "links",
                                foreignField: "nodeId",
                                localField: "_id",
                                as: "linkArr",
                            }
                        }
                    ],
                    as: "postArr",
                }
            },
        ]);

        // return 404 if missing object at any stage
        if (!graphObj.length || !graphObj[0].postArr.length || !graphObj[0].postArr[0].projectArr.length) {
            return { notFound: true };
        }

        const thisAuthor = graphObj[0];
        const thisPost = thisAuthor.postArr[0];
        const linkedSnippets = thisPost.linkedSnippetsArr || [];
        const thisLinks = thisPost.linkArr || [];
        const thisProjects = thisPost.projectArr;

        return { props: { postData: cleanForJSON(thisPost), linkedSnippets: linkedSnippets.map(d => d._id.toString()), thisProjects: cleanForJSON(thisProjects), thisAuthor: cleanForJSON(thisAuthor), thisLinks: cleanForJSON(thisLinks), key: postUrlName }};
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};