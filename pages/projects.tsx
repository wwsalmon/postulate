import {getSession} from "next-auth/client";
import {GetServerSideProps} from "next";
import {FiPlus} from "react-icons/fi";
import UpSEO from "../components/standard/UpSEO";
import UpButton from "../components/style/UpButton";
import {ssrRedirect} from "next-response-helpers";

export default function Projects({}: {  }) {

    return (
        <div className="max-w-4xl mx-auto px-4">
            <UpSEO title="Projects"/>
            <div className="flex items-center">
                <h1 className="up-h1">Projects</h1>
                <UpButton onClick={() => {}} small={true} className="ml-auto">
                    <div className="flex items-center">
                        <FiPlus/>
                        <span className="ml-2">New project</span>
                    </div>
                </UpButton>
            </div>
            <hr className="my-8"/>
            <h3 className="up-ui-title mb-4">Your projects</h3>
            <p>to be built</p>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session || !session.userId) return ssrRedirect(session ? "/auth/newaccount" : "/auth/signin");

    return {props: {}};
};