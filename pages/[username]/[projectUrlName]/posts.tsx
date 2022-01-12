import React from "react";
import {GetServerSideProps} from "next";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import MainShell from "../../../components/project/MainShell";
import getProjectSSRProps from "../../../utils/getProjectSSRProps";

export default function ProjectPage({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    return (
        <MainShell thisUser={thisUser} pageProject={pageProject} pageUser={pageUser}>
            <p>posts</p>
        </MainShell>
    );
}

export const getServerSideProps: GetServerSideProps = getProjectSSRProps;