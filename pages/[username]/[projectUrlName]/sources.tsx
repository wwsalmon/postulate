import {GetServerSideProps} from "next";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import React from "react";
import TypeShell from "../../../components/project/TypeShell";

export default function ProjectSources(props: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    return (
        <TypeShell {...props} type="source"/>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("source");