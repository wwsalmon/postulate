import React, {useEffect, useState} from "react";
import {GetServerSideProps} from "next";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell, {NodeWithShortcut} from "../../../components/project/MainShell";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import Link from "next/link";
import {format} from "date-fns";
import slateWordCount from "../../../slate/slateWordCount";
import getProjectUrl from "../../../utils/getProjectUrl";
import Badge from "../../../components/style/Badge";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import {ExternalBadge} from "../../../components/project/NodeCard";
import {useRouter} from "next/router";

export default function ProjectPosts({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const [iter, setIter] = useState<number>(0);

    const {data} = useSWR<{nodes: DatedObj<NodeWithShortcut>[]}>(`/api/node?projectId=${pageProject._id}&type=post&isOwner=${!!isOwner}&iter=${iter}`, fetcher);

    const router = useRouter();
    const {refresh} = router.query;

    useEffect(() => {
        if (refresh) {
            router.replace({pathname: router.asPath.split("?")[0], query: {}}).then(() => setIter(iter + 1));
        }
    }, [refresh]);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            {data && data.nodes.map(node => {
                const isPublished = !!node.body.publishedTitle;
                const hasChanges = isOwner && isPublished && JSON.stringify(node.body.publishedBody) !== JSON.stringify(node.body.body);
                const isExternal = !!node.shortcutArr;

                return (
                    <Link
                        href={`${getProjectUrl(pageUser, pageProject)}/${(isOwner && !isExternal) ? node._id : `/p/${node.body.urlName}`}`}
                        key={`project-posts-${node._id}`}
                    >
                        <a className="block mb-8">
                            <h3
                                className="font-manrope font-semibold mb-2 md:mb-0"
                                key={node._id}
                            >{(isOwner ? node.body.title : node.body.publishedTitle) || "Untitled post"}</h3>
                            <div className="md:flex items-center text-gray-400 text-sm">
                                {!isPublished && (
                                    <Badge dark={true} className="mr-3 mt-2">
                                        <span>Unpublished draft</span>
                                    </Badge>
                                )}
                                <span className="mr-3 mt-2">
                                    Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? node.body.lastPublishedDate : node.updatedAt), "MMM d, yyyy")}
                                </span>
                                <span className="mr-3 mt-2">{Math.ceil(slateWordCount(isOwner ? node.body.body : node.body.publishedBody) / 200)} min read</span>
                                {hasChanges && (
                                    <Badge className="mr-3 mt-2">
                                        Unpublished changes
                                    </Badge>
                                )}
                                {isExternal && (
                                    <ExternalBadge className="mt-2"/>
                                )}
                            </div>
                        </a>
                    </Link>
                );
            })}
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("post");