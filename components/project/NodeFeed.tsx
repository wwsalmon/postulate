import {DatedObj, NodeTypes} from "../../utils/types";
import {ProjectPageProps} from "../../utils/getPublicNodeSSRFunction";
import React, {useEffect, useState} from "react";
import useSWR from "swr";
import {NodeWithShortcut} from "./MainShell";
import {fetcher} from "../../utils/utils";
import {useRouter} from "next/router";
import NodeCard from "./NodeCard";
import PostItem from "./PostItem";
import PaginationBar from "../standard/PaginationBar";
import Link from "next/link";
import getProjectUrl from "../../utils/getProjectUrl";
import InlineButton from "../style/InlineButton";
import HomePostItem from "./HomePostItem";

export default function NodeFeed({type, isHome, ...props}: ProjectPageProps & {type: NodeTypes, isSidebar?: boolean, isHome?: boolean}) {
    const {pageProject, pageUser, thisUser, isSidebar} = props;

    const isOwner = thisUser && pageUser._id === thisUser._id;

    const [iter, setIter] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    const {data} = useSWR<{nodes: DatedObj<NodeWithShortcut>[], count: number}>(`/api/node?projectId=${pageProject._id}&type=${type}&isOwner=${!isHome && !!isOwner}&iter=${iter}&page=${page}&countPerPage=${isSidebar ? 6 : 20}`, fetcher);

    console.log(data);

    const isLoading = !data;

    const router = useRouter();
    const {refresh} = router.query;

    useEffect(() => {
        if (refresh) {
            router.replace({pathname: router.asPath.split("?")[0], query: {}}).then(() => setIter(iter + 1));
        }
    }, [refresh]);

    return isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
    ) : (
        <>
            {type === "evergreen" && !isSidebar && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data && data.nodes.map(node => (
                        <NodeCard
                            {...props}
                            pageNode={node}
                            key={`project-evergreen-${node._id}`}
                        />
                    ))}
                </div>
            )}
            {(type !== "evergreen" || isSidebar) && data && data.nodes.map(node => type === "post" ? isHome ? (
                <HomePostItem {...props} pageNode={node} className="mb-12 block" key={`project-post-${node._id}`}/>
            ) : (
                <PostItem
                    {...props}
                    pageNode={node}
                    key={`project-post-${node._id}`}
                />
            ) : (
                <NodeCard
                    {...props}
                    pageNode={node}
                    key={`project-evergreen-${node._id}`}
                    className="mb-4"
                />
            ))}
            {isSidebar ? (
                <InlineButton href={`${getProjectUrl(pageUser, pageProject)}/${type}s`} className="text-xs">
                    All {type}s &gt;
                </InlineButton>
            ) : (
                <PaginationBar page={page} count={data ? data.count : 0} label={`${type}s`} setPage={setPage} countPerPage={20} className="mt-16 mb-32"/>
            )}
        </>
    );
}