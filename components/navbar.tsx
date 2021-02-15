import Link from "next/link";
import {signOut, useSession} from "next-auth/client";
import SignInButton from "./sign-in-button";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="w-full bg-white sticky mb-8 top-0 z-30">
            <div className="max-w-7xl mx-auto h-16 flex items-center px-4">
                <Link href="/"><a><img src="/logo.svg" className="h-12"/></a></Link>
                <div className="ml-auto flex items-center h-full">
                    {session ? (
                        <>
                            <p className="hidden md:block">Signed in as {session.user.name}</p>
                            <button className="up-button text small ml-4" onClick={() => signOut()}>Sign out</button>
                        </>
                    ) : loading ? (
                        <p>Loading...</p>
                    ) : (
                        <SignInButton/>
                    )}
                </div>
            </div>
        </div>
    );
}