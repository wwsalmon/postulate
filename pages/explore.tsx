import React from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import ExploreFeed from "../components/explore/ExploreFeed";

export default function OldExplore({}: {  }) {
    return (
        <div className="w-full bg-gray-100 -mt-16 pt-20 -mb-12 min-h-screen">
            <div className="max-w-3xl mx-auto px-4">
                <SEO title="Explore"/>
                <H1 className="mb-4">Explore</H1>
                {/*<hr className="my-8"/>*/}
                {/*<UserSearch/>*/}
                <hr className="my-8"/>
                <ExploreFeed/>
            </div>
        </div>
    )
}