import SignInButton from "../standard/SignInButton";
import {useSession} from "next-auth/react";
import InlineButton from "../style/InlineButton";
import {useState} from "react";
import {FiChevronUp, FiHelpCircle, FiX} from "react-icons/fi";

export default function FloatingCta({}: {}) {
    const {data: session, status} = useSession();

    const [isHidden, setIsHidden] = useState<boolean>(false);

    return (
        <div className={`fixed bottom-12 sm:bottom-4 left-4 right-4 p-3 z-20 bg-gray-50 border border-gray-300 rounded max-w-sm ${(session && isHidden ? "w-10" : "")}`}>
            {session ? (
                <div className="flex">
                    {!isHidden && (
                        <p className="underline-links">Have feedback? Message <a href="https://twitter.com/wwsalmon">me on Twitter</a> or submit <a href="https://github.com/wwsalmon/postulate/issues">a GitHub issue</a></p>
                    )}
                    <InlineButton onClick={() => setIsHidden(!isHidden)} className="text-sm">
                        {isHidden ? (
                            <FiHelpCircle/>
                        ) : (
                            <FiX/>
                        )}
                    </InlineButton>
                </div>
            ) : (
                <>
                    {!isHidden && (
                        <p className="mb-3">Postulate is the best way to <b>take and share notes</b> for classes, research, and other learning.</p>
                    )}
                    <div className="flex items-center">
                        {isHidden ? (
                            <p className="truncate text-sm">Postulate is GitHub for knowledge</p>
                        ) : (
                            <>
                                <SignInButton className="mr-4"/>
                                <InlineButton href="/" className="text-sm">More info</InlineButton>
                            </>
                        )}
                        <InlineButton onClick={() => setIsHidden(!isHidden)} className="text-sm ml-auto">
                            {isHidden ? (
                                <FiChevronUp/>
                            ) : (
                                <FiX/>
                            )}
                        </InlineButton>
                    </div>
                </>
            )}
        </div>
    )
}