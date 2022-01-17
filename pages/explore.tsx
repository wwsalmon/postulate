import React from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import UserSearch from "../components/UserSearch";

export default function OldExplore({}: {  }) {

    return (
        <div className="max-w-5xl mx-auto px-4">
            <SEO title="Explore"/>
            <H1 className="mb-4">Explore</H1>
            <hr className="my-8"/>
            <UserSearch/>
            <hr className="my-8"/>
            <p>A full explore page is coming soon! <a href="https://twitter.com/postulateapp" className="underline">Follow Postulate on Twitter</a> for the latest updates.</p>
        </div>
    )
}