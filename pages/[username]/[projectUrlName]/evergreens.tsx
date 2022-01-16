import React from "react";
import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {ProjectPageProps} from "../../../utils/getPublicNodeSSRFunction";
import MainShell from "../../../components/project/MainShell";
import NodeFeed from "../../../components/project/NodeFeed";

export default function ProjectEvergreens(props: ProjectPageProps) {
    return (
        <MainShell {...props}>
            <NodeFeed {...props} type="evergreen"/>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("evergreen");