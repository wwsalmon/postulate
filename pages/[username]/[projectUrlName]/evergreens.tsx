import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell from "../../../components/project/MainShell";
import getProjectSSRProps from "../../../utils/getProjectSSRProps";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import Link from "next/link";
import {format} from "date-fns";
import getProjectUrl from "../../../utils/getProjectUrl";
import Badge from "../../../components/style/Badge";
import {SlateReadOnly} from "../../../slate/SlateEditor";
import {PublicNodePageProps} from "./p/[urlName]";
import EvergreenCard from "../../../components/project/EvergreenCard";

export default function ProjectEvergreens({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    const {data} = useSWR<{nodes: DatedObj<NodeObj>[]}>(`/api/node?projectId=${pageProject._id}&type=evergreen&isOwner=${!!isOwner}`, fetcher);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data && data.nodes.map(node => <EvergreenCard
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

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;