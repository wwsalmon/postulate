import {GetServerSideProps} from "next";
import React from "react";
import getPublicNodeSSRFunction, {PublicNodePageProps} from "../../../../utils/getPublicNodeSSRFunction";
import NodeShell from "../../../../components/project/NodeShell";

export default function PublicPostPage(props: PublicNodePageProps) {
    return (
        <NodeShell {...props}/>
    )
}

export const getServerSideProps: GetServerSideProps = getPublicNodeSSRFunction("post");