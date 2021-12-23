import {signIn} from "next-auth/client";
import {FaGoogle} from "react-icons/fa";
import React from "react";

export default function SignInButton() {
    return (
        <button
            className="up-button primary"
            onClick={() => signIn("google")}
        >
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </button>
    );
}