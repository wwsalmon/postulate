import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import {ProjectModel} from "../../models/project";

export default function ProjectRedirect() {
    return <></>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 404 if not correct url format
    if (Array.isArray(context.params.projectUrlName)) return {notFound: true};

    // check auth
    const session = await getSession(context);

    if (!session || !session.userId) return {
        redirect: {
            permanent: false,
            destination: session ? "/auth/newaccount" : "/auth/signin"
        }
    };

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const projectUrlName = context.params.projectUrlName;

        const thisProject = await ProjectModel.findOne({urlName: projectUrlName});

        if (!thisProject) return {notFound: true};

        return {redirect: {permanent: false, destination: `/projects/${thisProject._id.toString()}`}};
    } catch (e) {
        console.log(e);

        return {notFound: true};
    }
}