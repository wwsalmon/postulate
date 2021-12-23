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
    const {notifsIteration, setNotifsIteration} = useContext(NotifsContext);
    const [switcherOpen, setSwitcherOpen] = useState<boolean>(false);
    const {data: notifications, error: notificationsError}: responseInterface<{ data: DatedObj<NotificationWithAuthorAndTarget>[] }, any> = useSWR(`/api/notification?authed=${!!session&&!!(session&&session.userId)}&iter=${notifsIteration}`, (session && session.userId) ? fetcher : () => null);

    const notifsCount = (notifications && notifications.data) ? notifications.data.length : 0;
    const unreadCount = (notifications && notifications.data) ? notifications.data.filter(d => !d.read).length : 0;

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
                        <>
                            {notifications && (
                                <button className="up-hover-button relative h-10 px-4">
                                    <FiBell/>
                                    {!!unreadCount && (
                                        <div className="rounded-full w-3 h-3 top-0 right-0 absolute text-white font-bold" style={{backgroundColor: "#0026ff"}}>
                                                <span style={{ fontSize: 8, top: -9 }} className="relative">
                                                  {unreadCount}
                                                </span>
                                        </div>
                                    )}
                                    {!!notifsCount && (
                                        <div className="up-hover-dropdown mt-10 w-64">
                                            {notifications.data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map(notification => (
                                                <MoreMenuItem
                                                    text={(() => {
                                                        if (!notification.comment.length && !notification.reaction.length) return "Notification outdated";
                                                        const type = notification.type;
                                                        const isComment = ["postComment", "postCommentReply"].includes(type);
                                                        const author = isComment ? notification.comment[0].authorArr[0] : notification.reaction[0].authorArr[0];
                                                        const target = isComment ? notification.comment[0].post[0] : notification.reaction[0].post[0];
                                                        const targetAuthor = target && target.authorArr[0];

                                                        if (!targetAuthor) {
                                                            return "Invalid notification";
                                                        }

                                                        if (type === "postReaction" || type === "postComment") {
                                                            return <span><b>{author.name}</b> {type === "postReaction" ? "liked" : "commented on"} your {format(new Date(target.createdAt), "M/d/y")} post</span>
                                                        } else if (type === "postCommentReply") {
                                                            return <span><b>{author.name}</b> replied to your comment on {targetAuthor._id === session.userId ? "your" : `${targetAuthor.name}'s` } {format(new Date(target.createdAt), "M/d/y")} post</span>
                                                        }
                                                        return "notification";
                                                    })()}
                                                    wrapText={true}
                                                    href={(() => {
                                                        if (!notification.comment.length && !notification.reaction.length) return "";
                                                        const type = notification.type;
                                                        const isComment = ["postComment", "postCommentReply"].includes(type);
                                                        const target = isComment ? notification.comment[0].post[0] : notification.reaction[0].post[0];
                                                        const targetAuthor = target && target.authorArr[0];
                                                        if (!targetAuthor) return "";
                                                        return `/@${targetAuthor.username}/p/${target.urlName}?notif=${notification._id}`;
                                                    })()}
                                                    className={notification.read ? "opacity-25" : ""}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            )}
                            <button className="up-hover-button ml-6 relative">
                                <img src={session ? session.user.image : ""} className="w-6 sm:w-8 rounded-full"/>
                                <div className="up-hover-dropdown mt-8">
                                    {session.username && (
                                        <>
                                            <MoreMenuItem text="Profile" icon={<FiUser/>} href={`/@${session.username}`}/>
                                            <MoreMenuItem text="Projects" icon={<FiGrid/>} href="/projects" className="md:hidden"/>
                                            <MoreMenuItem text="Explore" icon={<FiSearch/>} href="/explore" className="md:hidden"/>
                                        </>
                                    )}
                                    <MoreMenuItem text="Sign out" onClick={() => signOut()}/>
                                </div>
                            </button>
                        </>
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