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
import {SlateReadOnly} from "../../../slate/SlateEditor";

export default function ProjectEvergreens({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const {data} = useSWR<{nodes: DatedObj<NodeObj>[]}>(`/api/node?projectId=${pageProject._id}&type=evergreen&isOwner=${!!isOwner}`, fetcher);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data && data.nodes.map(node => {
                    console.log(node);
                    const isPublished = !!node.body.publishedTitle;
                    const hasChanges = isOwner && isPublished && JSON.stringify(node.body.publishedBody) !== JSON.stringify(node.body.body);

                    return (
                        <Link
                            href={`${getProjectUrl(pageUser, pageProject)}/${isOwner ? node._id : `/e/${node.body.urlName}`}`}
                            key={`project-evergreens-${node._id}`}
                        >
                            <a className="p-4 border border-gray-300 rounded-md flex flex-col">
                                <div>
                                    <h3
                                        className="font-manrope font-semibold mb-1"
                                        key={node._id}
                                    >{(isOwner ? node.body.title : node.body.publishedTitle) || "Untitled post"}</h3>
                                    {!isPublished && (
                                        <Badge dark={true}>
                                            <span>Unpublished draft</span>
                                        </Badge>
                                    )}
                                    {hasChanges && (
                                        <Badge>
                                            <span>Unpublished changes</span>
                                        </Badge>
                                    )}
                                    <div className="max-h-48 text-gray-500 truncate relative">
                                        <SlateReadOnly
                                            value={isPublished ? node.body.publishedBody : node.body.body}
                                            fontSize={16}
                                            className="text-gray-400"
                                        />
                                        <div className="w-full absolute top-40 left-0 h-8 bg-gradient-to-t from-white"></div>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-auto pt-4">
                                    Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? node.body.lastPublishedDate : node.updatedAt), "MMM d, yyyy")}
                                </p>
                            </a>
                        </Link>
                    );
                })}
            </div>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;