import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import TypeShell from "../../../components/project/TypeShell";

export default function ProjectPosts(props: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    return (
        <TypeShell {...props} type="post"/>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("post");