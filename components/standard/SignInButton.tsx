import {signIn} from "next-auth/react";
import {FaGoogle} from "react-icons/fa";
import React, {ReactNode} from "react";
import UiButton from "../style/UiButton";

export default function SignInButton({className, children}: {className?: string, children?: ReactNode}) {
    return (
        <UiButton
            className={`up-button primary ${className || ""}`}
            onClick={() => signIn("google")}
        >
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">{children || "Sign in"}</span>
            </div>
        </UiButton>
    );
}