import React, {useEffect, useState} from "react";
import {GetServerSideProps} from "next";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell, {NodeWithShortcut} from "../../../components/project/MainShell";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import NodeCard from "../../../components/project/NodeCard";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import {useRouter} from "next/router";

export default function ProjectEvergreens({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const [iter, setIter] = useState<number>(0);

    const {data} = useSWR<{nodes: DatedObj<NodeWithShortcut>[]}>(`/api/node?projectId=${pageProject._id}&type=evergreen&isOwner=${!!isOwner}&iter=${iter}`, fetcher);

    const router = useRouter();
    const {refresh} = router.query;

    useEffect(() => {
        if (refresh) {
            router.replace({pathname: router.asPath.split("?")[0], query: {}}).then(() => setIter(iter + 1));
        }
    }, [refresh]);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data && data.nodes.map(node => <NodeCard
                    pageUser={pageUser}
                    pageProject={pageProject}
                    pageNode={node}
                    thisUser={thisUser}
                    key={`project-evergreen-${node._id}`}
                />)}
            </div>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("evergreen");