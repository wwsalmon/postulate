import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import Link from "next/link";
import {FiPlus} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/utils";
import {DatedObj, ProjectObj, ProjectObjWithCounts, UserObj} from "../utils/types";
import UpSEO from "../components/up-seo";
import ProjectItem from "../components/project-item";

export default function Projects({}: {  }) {
    const {data: projects, error: projectsError}: responseInterface<{projects: DatedObj<ProjectObjWithCounts>[] }, any> = useSWR("/api/project", fetcher);
    const {data: sharedProjects, error: sharedProjectsError}: responseInterface<{projects: DatedObj<ProjectObjWithCounts>[], owners: DatedObj<UserObj>[] }, any> = useSWR("/api/project?shared=true", fetcher);
    const [session, loading] = useSession();

    console.log(sharedProjects);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
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
            <h3 className="up-ui-title mb-4">Your projects</h3>
            {((!projects && !projectsError) || loading) ? ( // SWR projects loading
                <Skeleton count={10}/>
            ) : (projects.projects.length === 0) ? ( // loaded, no projects
                <p className="opacity-50">Hit "New project" to create a new project!</p>
            ) : (
                <div className="md:flex -mx-2 flex-wrap">
                    {projects.projects.map(project => (
                        <ProjectItem
                            project={project}
                            owners={[]}
                            sessionUserId={session ? session.userId : null}
                            isProjects={true}
                        />
                    ))}
                </div>
            )}
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-4">Shared with you</h3>
            {((!sharedProjects && !sharedProjectsError) || loading) ? ( // SWR projects loading
                <Skeleton count={10}/>
            ) : (sharedProjects.projects.length === 0) ? ( // loaded, no projects
                <p className="opacity-50">No projects have been shared with you</p>
            ) : (
                <div className="md:flex -mx-4">
                    {sharedProjects.projects.map(project => (
                        <ProjectItem
                            project={project}
                            owners={sharedProjects.owners}
                            sessionUserId={session ? session.userId : null}
                            isProjects={true}
                        />
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