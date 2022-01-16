import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import getProjectSSRFunction from "../../../utils/getProjectSSRFunction";
import TypeShell from "../../../components/project/TypeShell";

export default function ProjectEvergreens(props: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    return (
        <TypeShell {...props} type="evergreen"/>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRFunction("evergreen");