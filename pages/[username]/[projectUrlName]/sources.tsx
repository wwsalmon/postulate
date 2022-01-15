import {GetServerSideProps} from "next";
import getProjectSSRProps from "../../../utils/getProjectSSRProps";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import MainShell from "../../../components/project/MainShell";
import React from "react";
import NodeCard from "../../../components/project/NodeCard";

export default function ProjectSources({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const {data} = useSWR<{ nodes: DatedObj<NodeObj>[] }>(`/api/node?projectId=${pageProject._id}&type=source&isOwner=${!!isOwner}`, fetcher);

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

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;