import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import {FiBell, FiChevronDown, FiGrid, FiSearch, FiUser} from "react-icons/fi";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {MoreMenu, MoreMenuItem} from "../headless/MoreMenu";
import UiButton from "../style/UiButton";
import useSWR from "swr";
import {fetcher} from "../../utils/utils";
import {DatedObj} from "../../utils/types";
import {NotificationApiResponse} from "../../pages/api/notification";
import getProjectUrl from "../../utils/getProjectUrl";
import {formatDistanceToNow} from "date-fns";

function NotificationItem({notification}: {notification: DatedObj<NotificationApiResponse>}) {
    return (
        <MoreMenuItem
            href={`${getProjectUrl(notification.node.user, notification.node.project)}/${notification.node.type.substring(0, 1)}/${notification.node.body.urlName}`}
            className={`max-w-[240px] ${notification.read ? "opacity-50" : ""}`}
        >
            <span className={notification.read ? "" : "font-bold"}>
                {notification.author.name} liked your {notification.type === "commentLike" ? "comment" : "post"}
            </span>
            <span className="text-gray-500 ml-1">
                {formatDistanceToNow(new Date(notification.createdAt))} ago
            </span>
        </MoreMenuItem>
    );
}

export default function Navbar() {
    const router = useRouter();
    const {data: session, status} = useSession();

    const isPublicPage = router.route.substring(0, 28) === "/[username]/[projectUrlName]";

    useEffect(() => {
        // @ts-ignore window.analytics undefined below
        if (session) window.analytics.identify(session.userId, {
            username: session.username,
            email: session.user.email,
        });
    }, [status]);

    const {data: notificationsData} = useSWR(`/api/notification?authed=${!!session}`, session ? fetcher : () => []);

    return (
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="mx-auto h-12 sm:h-16 flex items-center px-4">
                <Link href={session ? "/repositories" : "/"}><a><img src="/logo.svg" className={`${isPublicPage ? "hidden sm:block" : ""} h-8 mr-10`}/></a></Link>
                <Link href={session ? "/repositories" : "/"}><a><img src="/postulate-tile.svg" className={`h-6 ${isPublicPage ? "sm:hidden" : "hidden"} mr-10`}/></a></Link>
                {session && (
                    <Link href={"/repositories"}>
                        <a className={`hidden ${isPublicPage ? "lg" : "md"}:flex items-center opacity-50 hover:opacity-100 mr-10`}>
                            <div className="mr-3">
                                <FiGrid/>
                            </div>
                            Projects
                        </a>
                    </Link>
                )}
                <Link href="/explore">
                    <a className={`hidden ${isPublicPage ? "lg" : "md"}:flex items-center opacity-50 hover:opacity-100 mr-10`}>
                        <div className="mr-3">
                            <FiSearch/>
                        </div>
                        Explore
                    </a>
                </Link>
                <div className="ml-auto flex items-center h-full">
                    {session && notificationsData && (
                        <MoreMenu button={(
                            <div className="relative">
                                <UiButton noBg={true} onClick={() => null} className="mr-2 py-2">
                                    <FiBell/>
                                </UiButton>
                                {!!notificationsData.filter(d => !d.read).length && (
                                    <div className="w-3 h-3 rounded-full bg-red-500 absolute right-3 top-0 text-[8px] text-white text-center font-bold">
                                        <span>{notificationsData.filter(d => !d.read).length}</span>
                                    </div>
                                )}
                            </div>
                        )}>
                            {notificationsData.map(notification => (
                                <NotificationItem notification={notification} key={notification._id}/>
                            ))}
                        </MoreMenu>
                    )}
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
                    ) : status === "loading" ? (
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
            <div className="fixed left-0 bottom-0 w-full bg-white h-12 sm:hidden flex items-center">
                {session && (
                    <Link href={"/repositories"}>
                        <a className={`flex items-center justify-center opacity-50 hover:opacity-100 px-4 w-1/3`}>
                            <div className="mr-3">
                                <FiGrid/>
                            </div>
                            Projects
                        </a>
                    </Link>
                )}
                <Link href="/explore">
                    <a className={`flex items-center justify-center opacity-50 hover:opacity-100 px-4 ${session ? "w-1/3" : "w-full"}`}>
                        <div className="mr-3">
                            <FiSearch/>
                        </div>
                        Explore
                    </a>
                </Link>
                {session && (
                    <Link href={`/profile`}>
                        <a className={`flex items-center justify-center opacity-50 hover:opacity-100 px-4 w-1/3`}>
                            <div className="mr-3">
                                <FiUser/>
                            </div>
                            Profile
                        </a>
                    </Link>
                )}
            </div>
        </div>
    );
}