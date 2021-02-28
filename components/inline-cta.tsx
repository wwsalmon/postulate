import React from 'react';
import UpBanner from "./UpBanner";
import Link from "next/link";

export default function InlineCTA() {
    return (
        <UpBanner>
            <p><b>10x your writing output with Postulate,</b> an all-in-one tool for collecting and publishing your knowledge.</p>
            <Link href={`/#waitlist`}>
                <a className="up-button primary small ml-auto mt-4 md:mt-0 flex-shrink-0">Sign up for waitlist</a>
            </Link>
        </UpBanner>
    );
}