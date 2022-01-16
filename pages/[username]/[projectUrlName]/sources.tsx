import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell, {NodeWithShortcut} from "../../../components/project/MainShell";
import React, {useEffect, useState} from "react";
import NodeCard from "../../../components/project/NodeCard";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import {useRouter} from "next/router";

export default function ProjectSources({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const [iter, setIter] = useState<number>(0);

    const {data} = useSWR<{ nodes: DatedObj<NodeWithShortcut>[] }>(`/api/node?projectId=${pageProject._id}&type=source&isOwner=${!!isOwner}&iter=${iter}`, fetcher);

    const router = useRouter();
    const {refresh} = router.query;

    useEffect(() => {
        if (refresh) {
            router.replace({pathname: router.asPath.split("?")[0], query: {}}).then(() => setIter(iter + 1));
        }
    }, [refresh]);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            {data && data.nodes.map(node => (
                <NodeCard
                    pageUser={pageUser}
                    pageProject={pageProject}
                    pageNode={node}
                    thisUser={thisUser}
                    className="mb-8"
                />
            ))}
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("source");