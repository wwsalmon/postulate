import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import Link from "next/link";
import {FiPlus} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";

export default function Projects({}: {  }) {
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
            {loading ? (
                <Skeleton count={10}/>
            ) : (
                <p>loaded</p>
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