import Link from "next/link";
import {signOut, useSession} from "next-auth/client";
import {FiChevronDown, FiGrid, FiSearch} from "react-icons/fi";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {MoreMenu, MoreMenuItem} from "../headless/MoreMenu";
import UiButton from "../style/UiButton";

export default function Navbar() {
    const router = useRouter();
    const [session, loading] = useSession();

    const isPublicPage = ["/[username]/[projectUrlName]/p/[urlName]"].includes(router.route);

    useEffect(() => {
        // @ts-ignore window.analytics undefined below
        if (session) window.analytics.identify(session.userId, {
            username: session.username,
            email: session.user.email,
        });
    }, [loading]);

    return (
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="mx-auto h-12 sm:h-16 flex items-center px-4">
                <Link href={session ? "/projects" : "/"}><a><img src="/logo.svg" className={`${isPublicPage ? "hidden sm:block" : ""} h-8 mr-10`}/></a></Link>
                <Link href={session ? "/projects" : "/"}><a><img src="/postulate-tile.svg" className={`h-6 ${isPublicPage ? "sm:hidden" : "hidden"} mr-10`}/></a></Link>
                {session && (
                    <Link href={"/projects"}>
                        <a className={`hidden ${isPublicPage ? "xl" : "md"}:flex items-center opacity-50 hover:opacity-100 mr-10`}>
                            <div className="mr-3">
                                <FiGrid/>
                            </div>
                            Projects
                        </a>
                    </Link>
                )}
                <Link href="/explore">
                    <a className={`hidden ${isPublicPage ? "xl" : "md"}:flex items-center opacity-50 hover:opacity-100 mr-10`}>
                        <div className="mr-3">
                            <FiSearch/>
                        </div>
                        Explore
                    </a>
                </Link>
                <div className="ml-auto flex items-center h-full">
                    {session ? (
                        <MoreMenu button={(
                            <button className="flex items-center p-1 rounded-md -mr-1 hover:bg-gray-100 transition">
                                <FiChevronDown/>
                                <img src={session ? session.user.image : ""} className="w-6 sm:w-8 rounded-full ml-2"/>
                            </button>
                        )}>
                            <MoreMenuItem href="/profile">Profile</MoreMenuItem>
                            <MoreMenuItem onClick={() => signOut()}>Sign out</MoreMenuItem>
                        </MoreMenu>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <UiButton href="/auth/signin">
                                Sign in
                            </UiButton>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}