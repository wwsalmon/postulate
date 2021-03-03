import Link from "next/link";
import {signOut, useSession} from "next-auth/client";
import {FiGrid, FiUser} from "react-icons/fi";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
                <Link href={session ? "/projects" : "/"}><a><img src="/logo.svg" className="h-10"/></a></Link>
                <div className="ml-auto flex items-center h-full">
                    {session ? (
                        <>
                            <Link href={"/projects"}>
                                <a className="hidden md:flex items-center opacity-50 hover:opacity-100 mr-10">
                                    <div className="mr-3">
                                        <FiGrid/>
                                    </div>
                                    Projects
                                </a>
                            </Link>
                            <Link href={`/@${session.username}`}>
                                <a className="hidden md:flex items-center opacity-50 hover:opacity-100">
                                    <div className="mr-3">
                                        <FiUser/>
                                    </div>
                                    Profile
                                </a>
                            </Link>
                            <MoreMenu className="ml-6">
                                <MoreMenuItem text="Profile" icon={<FiUser/>} href={`/@${session.username}`} className="md:hidden"/>
                                <MoreMenuItem text="Projects" icon={<FiGrid/>} href="/projects" className="md:hidden"/>
                                <MoreMenuItem text="Sign out" onClick={() => signOut()}/>
                            </MoreMenu>
                        </>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <Link href="/#waitlist">
                                <a className="up-button primary small">Sign up for waitlist</a>
                            </Link>
                            {/*<SignInButton/>*/}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}