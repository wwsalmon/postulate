import React, {useEffect, useState} from "react";
import {DatedObj, NodeTypes, ProjectObj, UserObj} from "../../utils/types";
import MainShell, {NodeWithShortcut} from "../../components/project/MainShell";
import Link from "next/link";
import {format} from "date-fns";
import slateWordCount from "../../slate/slateWordCount";
import getProjectUrl from "../../utils/getProjectUrl";
import Badge from "../../components/style/Badge";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import {ExternalBadge} from "../../components/project/NodeCard";
import {useRouter} from "next/router";
import PaginationBar from "../../components/standard/PaginationBar";
import NodeCard from "./NodeCard";
import {findImages} from "../../slate/withImages";

export default function TypeShell({pageProject, pageUser, thisUser, type}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, type: NodeTypes }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const [iter, setIter] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    const {data} = useSWR<{nodes: DatedObj<NodeWithShortcut>[], count: number}>(`/api/node?projectId=${pageProject._id}&type=${type}&isOwner=${!!isOwner}&iter=${iter}&page=${page}`, fetcher);

    const router = useRouter();
    const {refresh} = router.query;

    useEffect(() => {
        if (refresh) {
            router.replace({pathname: router.asPath.split("?")[0], query: {}}).then(() => setIter(iter + 1));
        }
    }, [refresh]);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            {type === "evergreen" && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data && data.nodes.map(node => <NodeCard
                        pageUser={pageUser}
                        pageProject={pageProject}
                        pageNode={node}
                        thisUser={thisUser}
                        key={`project-evergreen-${node._id}`}
                    />)}
                </div>
            )}
            {type !== "evergreen" && data && data.nodes.map(node => {
                if (type === "source") return (
                    <NodeCard
                        pageUser={pageUser}
                        pageProject={pageProject}
                        pageNode={node}
                        thisUser={thisUser}
                        key={`project-evergreen-${node._id}`}
                    />
                );

                const isPublished = !!node.body.publishedTitle;
                const hasChanges = isOwner && isPublished && JSON.stringify(node.body.publishedBody) !== JSON.stringify(node.body.body);
                const isExternal = !!node.shortcutArr;
                const images = findImages(node.body.publishedBody || node.body.body);
                const firstImage = images[0];

                return (
                    <Link
                        href={`${getProjectUrl(pageUser, pageProject)}/${(isOwner && !isExternal) ? node._id : `/p/${node.body.urlName}`}`}
                        key={`project-${type}-${node._id}`}
                    >
                        <a className="block mb-8 flex items-center">
                            <div className="flex-grow">
                                <h3
                                    className="font-manrope font-semibold mb-2 md:mb-0"
                                    key={node._id}
                                >{(isOwner ? node.body.title : node.body.publishedTitle) || `Untitled post`}</h3>
                                <div className="flex items-center flex-wrap text-gray-400 text-sm">
                                    {!isPublished && (
                                        <Badge dark={true} className="mr-3 mt-2">
                                            <span>Unpublished draft</span>
                                        </Badge>
                                    )}
                                    <p className="mr-3 mt-2">
                                        Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? node.body.lastPublishedDate : node.updatedAt), "MMM d, yyyy")}
                                    </p>
                                    <p className="mr-3 mt-2">{Math.ceil(slateWordCount(isOwner ? node.body.body : node.body.publishedBody) / 200)} min read</p>
                                    {hasChanges && (
                                        <Badge className="mr-3 mt-2">
                                            Unpublished changes
                                        </Badge>
                                    )}
                                    {isExternal && (
                                        <ExternalBadge className="mt-2"/>
                                    )}
                                </div>
                            </div>
                            {firstImage && (
                                <img src={firstImage} className="w-24 h-20 object-cover ml-4 flex-shrink-0"/>
                            )}
                        </a>
                    </Link>
                );
            })}
            <PaginationBar page={page} count={data ? data.count : 0} label={`${type}s`} setPage={setPage} countPerPage={20} className="mt-16 mb-32"/>
        </MainShell>
    );
}