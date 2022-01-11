import Link from "next/link";
import {useSession} from "next-auth/client";
import {FiGrid, FiSearch} from "react-icons/fi";
import {useEffect, useState} from "react";
import UiModal from "../style/UiModal";
import Mousetrap from "mousetrap";
import NavbarSwitcher from "./NavbarSwitcher";
import InlineButton from "../style/InlineButton";

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
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="mx-auto h-12 sm:h-16 flex items-center px-4">
                <Link href={session ? "/projects" : "/"}><a><img src="/logo.svg" className="h-8 sm:h-10 mr-10"/></a></Link>
                    {session && (
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