import React from "react";
import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {ProjectPageProps} from "../../../utils/getPublicNodeSSRFunction";
import MainShell from "../../../components/project/MainShell";
import NodeFeed from "../../../components/project/NodeFeed";

export default function ProjectPosts(props: ProjectPageProps) {
    return (
        <MainShell {...props}>
            <NodeFeed {...props} type="post"/>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("post");