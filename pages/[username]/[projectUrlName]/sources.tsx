import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell, {NodeWithShortcut} from "../../../components/project/MainShell";
import React from "react";
import NodeCard from "../../../components/project/NodeCard";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";

export default function ProjectSources({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const {data} = useSWR<{ nodes: DatedObj<NodeWithShortcut>[] }>(`/api/node?projectId=${pageProject._id}&type=source&isOwner=${!!isOwner}`, fetcher);

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