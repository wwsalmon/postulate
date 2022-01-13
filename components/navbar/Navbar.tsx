import Link from "next/link";
import {useSession} from "next-auth/client";
import {FiGrid, FiSearch} from "react-icons/fi";
import {useEffect, useState} from "react";
import UiModal from "../style/UiModal";
import Mousetrap from "mousetrap";
import NavbarSwitcher from "./NavbarSwitcher";
import InlineButton from "../style/InlineButton";
import {useRouter} from "next/router";

export default function Navbar() {
    const router = useRouter();
    const [session, loading] = useSession();
    const [switcherOpen, setSwitcherOpen] = useState<boolean>(false);

    const isPublicPage = ["/[username]/[projectUrlName]/p/[urlName]"].includes(router.route);

    useEffect(() => {
        function onSwitcherShortcut(e) {
            e.preventDefault();
            setSwitcherOpen(true);
        }

        Mousetrap.bind("g", onSwitcherShortcut);

        return () => {
            Mousetrap.unbind("g", onSwitcherShortcut);
        };
    }, []);

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
                    {session && (
                        <UiModal isOpen={switcherOpen} setIsOpen={setSwitcherOpen}>
                            <NavbarSwitcher setOpen={setSwitcherOpen}/>
                        </UiModal>
                    )}
                    {session ? (
                        <img src={session ? session.user.image : ""} className="w-6 sm:w-8 rounded-full"/>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <InlineButton href="/auth/signin">
                                Sign in
                            </InlineButton>
                            {/*<SignInButton/>*/}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}