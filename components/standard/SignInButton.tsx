import {signIn} from "next-auth/react";
import {FaGoogle} from "react-icons/fa";
import React from "react";
import UiButton from "../style/UiButton";

export default function SignInButton() {
    return (
        <UiButton
            className="up-button primary"
            onClick={() => signIn("google")}
        >
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </UiButton>
    );
}