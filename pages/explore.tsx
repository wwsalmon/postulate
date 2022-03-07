import React from "react";
import SEO from "../components/standard/SEO";
import H1 from "../components/style/H1";
import ExploreFeed from "../components/explore/ExploreFeed";

export default function OldExplore({}: {  }) {
    return (
        <>
            <SEO title="Explore"/>
            <div className="max-w-3xl mx-auto px-4 pb-8">
                <H1>Explore</H1>
            </div>
            <div className="w-full bg-gray-100 py-8 border-t">
                <div className="max-w-3xl mx-auto px-4">
                    {/*<hr className="my-8"/>*/}
                    {/*<UserSearch/>*/}
                    <ExploreFeed/>
                </div>
            </div>
        </>
    )
}