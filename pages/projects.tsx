import {getSession, useSession} from "next-auth/client";
import {GetServerSideProps} from "next";

export default function Projects({}: {  }) {
    const [session, loading] = useSession();

    return (
        <div className="max-w-4xl mx-auto px-4">
            {session ? (
                <p>Logged in as {session.user.name} with user ID {session.userId}</p>
            ) : (
                <p>Loading...</p>
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