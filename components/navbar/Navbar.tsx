import Link from "next/link";
import {signOut, useSession} from "next-auth/client";
import {FiBell, FiGrid, FiSearch, FiUser} from "react-icons/fi";
import MoreMenuItem from "../style/MoreMenuItem";
import useSWR, {responseInterface} from "swr";
import {DatedObj, NotificationWithAuthorAndTarget} from "../../utils/types";
import {fetcher} from "../../utils/utils";
import {format} from "date-fns";
import {useContext, useEffect, useState} from "react";
import {NotifsContext} from "../../pages/_app";
import UpModal from "../style/UpModal";
import Mousetrap from "mousetrap";
import NavbarSwitcher from "./NavbarSwitcher";
import UpInlineButton from "../style/UpInlineButton";

export default function Navbar() {
    const [session, loading] = useSession();
    const [switcherOpen, setSwitcherOpen] = useState<boolean>(false);

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
        <div className="w-full bg-white sticky mb-8 top-0 z-30 shadow-sm border-b up-border-gray-200">
            <div className="mx-auto h-12 sm:h-16 flex items-center px-4">
                <Link href={session ? "/projects" : "/"}><a><img src="/logo.svg" className="h-8 sm:h-10 mr-10"/></a></Link>
                    {session && session.username && (
                        <Link href={"/projects"}>
                            <a className="hidden md:flex items-center opacity-50 hover:opacity-100 mr-10">
                                <div className="mr-3">
                                    <FiGrid/>
                                </div>
                                Projects
                            </a>
                        </Link>
                    )}
                    <Link href="/explore">
                        <a className="hidden md:flex items-center opacity-50 hover:opacity-100 mr-10">
                            <div className="mr-3">
                                <FiSearch/>
                            </div>
                            Explore
                        </a>
                    </Link>
                <div className="ml-auto flex items-center h-full">
                    {session && (
                        <UpModal isOpen={switcherOpen} setIsOpen={setSwitcherOpen}>
                            <NavbarSwitcher setOpen={setSwitcherOpen}/>
                        </UpModal>
                    )}
                    {session ? (
                        <img src={session ? session.user.image : ""} className="w-6 sm:w-8 rounded-full"/>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <UpInlineButton href="/auth/signin" className="hidden sm:inline-block mr-3">
                                Sign in
                            </UpInlineButton>
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