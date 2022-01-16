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

export default function NodeFeed({type, isSidebar, ...props}: ProjectPageProps & {type: NodeTypes, isSidebar?: boolean}) {
    const {pageProject, pageUser, thisUser} = props;

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
        <>
            {type === "evergreen" && (
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
            {type !== "evergreen" && data && data.nodes.map(node => type === "source" ? (
                <NodeCard
                    {...props}
                    pageNode={node}
                    key={`project-evergreen-${node._id}`}
                    className="mb-4"
                />
            ) : (
                <PostItem
                    {...props}
                    pageNode={node}
                    key={`project-post-${node._id}`}
                />
            ))}
            <PaginationBar page={page} count={data ? data.count : 0} label={`${type}s`} setPage={setPage} countPerPage={20} className="mt-16 mb-32"/>
        </>
    );
}