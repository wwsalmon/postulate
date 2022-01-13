import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, NodeObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell from "../../../components/project/MainShell";
import getProjectSSRProps from "../../../utils/getProjectSSRProps";
import useSWR from "swr";
import {fetcher} from "../../../utils/utils";
import Link from "next/link";

export default function ProjectPage({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const {data} = useSWR<{nodes: DatedObj<NodeObj>[]}>(`/api/node?projectId=${pageProject._id}&type=post&isOwner=true`, fetcher);

    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            {data && data.nodes.map(node => (
                <Link href={`/@${pageUser.username}/${pageProject.urlName}/${node._id}`}>
                    <a>
                        {!node.body.publicBody && <p>Draft</p>}
                        <p key={node._id}>{node.body.title || "Untitled post"}</p>
                    </a>
                </Link>
            ))}
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;