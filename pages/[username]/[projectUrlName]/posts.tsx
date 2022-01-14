import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell from "../../../components/project/MainShell";
import getProjectSSRProps from "../../../utils/getProjectSSRProps";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import Link from "next/link";
import {format} from "date-fns";
import slateWordCount from "../../../slate/slateWordCount";
import getProjectUrl from "../../../utils/getProjectUrl";
import Badge from "../../../components/style/Badge";

export default function ProjectPosts({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const {data} = useSWR<{nodes: DatedObj<NodeObj>[]}>(`/api/node?projectId=${pageProject._id}&type=post&isOwner=${!!isOwner}`, fetcher);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            {data && data.nodes.map(node => {
                const isPublished = !!node.body.publishedTitle;
                const hasChanges = isOwner && isPublished && JSON.stringify(node.body.publishedBody) !== JSON.stringify(node.body.body);

                return (
                    <Link
                        href={`${getProjectUrl(pageUser, pageProject)}/${isOwner ? node._id : `/p/${node.body.urlName}`}`}
                        key={`project-posts-${node._id}`}
                    >
                        <a className="block mb-8">
                            <h3
                                className="font-manrope font-semibold"
                                key={node._id}
                            >{(isOwner ? node.body.title : node.body.publishedTitle) || "Untitled post"}</h3>
                            <div className="flex items-center mt-2 text-gray-400 text-sm">
                                {!isPublished && (
                                    <Badge dark={true} className="mr-3">
                                        <span>Unpublished draft</span>
                                    </Badge>
                                )}
                                <span className="mr-3">
                                    Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? node.body.lastPublishedDate : node.updatedAt), "MMM d, yyyy")}
                                </span>
                                <span className="mr-3">{Math.ceil(slateWordCount(isOwner ? node.body.body : node.body.publishedBody) / 200)} min read</span>
                                {hasChanges && (
                                    <Badge>
                                        Unpublished changes
                                    </Badge>
                                )}
                            </div>
                        </a>
                    </Link>
                );
            })}
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;