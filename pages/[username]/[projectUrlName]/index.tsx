import React from "react";
import {GetServerSideProps} from "next";
import MainShell from "../../../components/project/MainShell";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import UiH3 from "../../../components/style/UiH3";
import NodeFeed from "../../../components/project/NodeFeed";
import {ProjectPageProps} from "../../../utils/getPublicNodeSSRFunction";

export default function ProjectPage(props: ProjectPageProps) {
    return (
        <MainShell {...props}>
            <div className="md:flex mb-32">
                <div className="flex-grow">
                    <NodeFeed {...props} type="post" isHome={true}/>
                </div>
                <div className="md:w-64 md:ml-12 flex-shrink-0">
                    <UiH3 className="mb-8 text-sm">Latest evergreens</UiH3>
                    <NodeFeed {...props} type="evergreen" isSidebar={true}/>
                    <hr className="my-12"/>
                    <UiH3 className="mb-8 text-sm">Latest sources</UiH3>
                    <NodeFeed {...props} type="source" isSidebar={true}/>
                </div>
            </div>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction();