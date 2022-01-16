import {GetServerSideProps} from "next";
import dbConnect from "./dbConnect";
import {getProjectPageInfo} from "../pages/[username]/[projectUrlName]/new/[type]";
import getThisUser from "./getThisUser";
import {cleanForJSON} from "./utils";
import {ssr404} from "next-response-helpers";
import {NodeTypes} from "./types";

const getProjectSSRFunction: (type?: NodeTypes) => GetServerSideProps = (type) => async (context) => {
    // fetch project info from MongoDB
    try {
        await dbConnect();

        const pageInfo = await getProjectPageInfo(context);

        if (!pageInfo) return ssr404;

        const {pageUser, pageProject} = pageInfo;

        const thisUser = await getThisUser(context);

        return {
            props: {
                pageProject: cleanForJSON(pageProject),
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                key: `${context.params.projectUrlName}-${type || "home"}`,
            }
        };
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};

export default getProjectSSRFunction;