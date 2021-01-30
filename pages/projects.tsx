import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import Link from "next/link";
import {FiPlus} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import {ProjectObj} from "../utils/types";

export default function Projects({}: {  }) {
    const {data: projects, error: projectsError}: responseInterface<{projects: ProjectObj[] }, any> = useSWR("/api/project/list", fetcher);
    const [session, loading] = useSession();

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center">
                <h1 className="up-h1">Projects</h1>
                <Link href="/projects/new">
                    <a className="up-button small ml-auto">
                        <div className="flex items-center">
                            <FiPlus/>
                            <span className="ml-2">New project</span>
                        </div>
                    </a>
                </Link>
            </div>
            <hr className="my-8"/>
            {((!projects && !projectsError) || loading) ? ( // SWR projects loading
                <Skeleton count={10}/>
            ) : (projects.projects.length === 0) ? ( // loaded, no projects
                <p className="content opacity-50">Hit "New project" to create a new project!</p>
            ) : (
                <div className="md:flex -mx-4">
                    {projects.projects.map(project => (
                        <Link href={`/@${session.username}/${project.urlName}`}>
                            <a className="block p-4 shadow-md rounded-md md:w-1/3 mx-4 mb-8 md:mb-0">
                                <h3 className="up-ui-item-title leading-tight mb-2">{project.name}</h3>
                                <p className="opacity-50">{project.description}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session || !session.userId) {
        context.res.setHeader("location", session ? "/auth/newaccount" : "/auth/signin");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};