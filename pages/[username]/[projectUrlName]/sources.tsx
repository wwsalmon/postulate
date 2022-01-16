import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import React from "react";
import {ProjectPageProps} from "../../../utils/getPublicNodeSSRFunction";
import MainShell from "../../../components/project/MainShell";
import NodeFeed from "../../../components/project/NodeFeed";

export default function ProjectSources(props: ProjectPageProps) {
    return (
        <MainShell {...props}>
            <NodeFeed {...props} type="source"/>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("source");