import Link from "next/link";
import {signOut, useSession} from "next-auth/client";
import {FiBell, FiEdit2, FiGrid, FiSearch, FiUser} from "react-icons/fi";
import MoreMenu from "./more-menu";
import MoreMenuItem from "./more-menu-item";
import {responseInterface} from "swr";
import {DatedObj, NotificationWithAuthorAndTarget} from "../utils/types";
import {fetcher} from "../utils/utils";
import useSWR from "swr";
import {format} from "date-fns";
import {useContext, useState} from "react";
import {NotifsContext} from "../pages/_app";
import UpModal from "./up-modal";
import NavbarSearchModal from "./navbar-search-modal";
import NavbarQuickSnippetModal from "./navbar-quick-snippet-modal";

export default function Navbar() {
    const [session, loading] = useSession();
    const {notifsIteration, setNotifsIteration} = useContext(NotifsContext);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [quickSnippetOpen, setQuickSnippetOpen] = useState<boolean>(false);
    const {data: notifications, error: notificationsError}: responseInterface<{ data: DatedObj<NotificationWithAuthorAndTarget>[] }, any> = useSWR(`/api/notification?authed=${!!session&&!!(session&&session.userId)}&iter=${notifsIteration}`, (session && session.userId) ? fetcher : () => null);

    const notifsCount = (notifications && notifications.data) ? notifications.data.length : 0;
    const unreadCount = (notifications && notifications.data) ? notifications.data.filter(d => !d.read).length : 0;

    return (
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
                <Link href={session ? "/projects" : "/"}><a><img src="/logo.svg" className="h-10 mr-10"/></a></Link>
                {session && session.username && (
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
                            <a className="hidden md:flex items-center opacity-50 hover:opacity-100 mr-10">
                                <div className="mr-3">
                                    <FiUser/>
                                </div>
                                Profile
                            </a>
                        </Link>
                    </>
                )}
                <div className="ml-auto flex items-center h-full">
                    {session && (
                        <>
                            <button className="up-button text small mr-2" onClick={() => setQuickSnippetOpen(true)}>
                                <FiEdit2/>
                            </button>
                            <UpModal isOpen={quickSnippetOpen} setIsOpen={setQuickSnippetOpen} wide={true}>
                                <NavbarQuickSnippetModal setOpen={setQuickSnippetOpen}/>
                            </UpModal>
                        </>
                    )}
                    <button className="up-button text small mr-2" onClick={() => setSearchOpen(true)}>
                        <FiSearch/>
                    </button>
                    <UpModal isOpen={searchOpen} setIsOpen={setSearchOpen}>
                        <NavbarSearchModal setOpen={setSearchOpen}/>
                        <button className="up-button text mt-4" onClick={() => setSearchOpen(false)}>Close</button>
                    </UpModal>
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
                                                        const author = isComment ? notification.comment[0].author[0] : notification.reaction[0].author[0];
                                                        const target = isComment ? notification.comment[0].post[0] : notification.reaction[0].post[0];
                                                        const targetAuthor = target.author[0];

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
                                                        const targetAuthor = target.author[0];
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
                                <img src={session ? session.user.image : ""} className="w-8 rounded-full"/>
                                <div className="up-hover-dropdown mt-8">
                                    {session.username && (
                                        <>
                                            <MoreMenuItem text="Projects" icon={<FiGrid/>} href="/projects" className="md:hidden"/>
                                            <MoreMenuItem text="Profile" icon={<FiUser/>} href={`/@${session.username}`}/>
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