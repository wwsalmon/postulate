import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import React, {HTMLProps, useCallback} from "react";
import getProjectUrl from "../../utils/getProjectUrl";
import Link from "next/link";
import {findImages} from "../../slate/withImages";
import {format} from "date-fns";
import slateWordCount from "../../slate/slateWordCount";
import LinesEllipsis from "react-lines-ellipsis";
import {getPlainTextFromSlateValue} from "../../slate/SlateEditor";
import {ExternalBadge} from "./NodeCard";
import UserButton from "../standard/UserButton";
import InlineButton from "../style/InlineButton";

function HomePostImage({className, ...props}: React.ComponentProps<"img">) {
    return (
        <div className={`relative ${className || ""}`}>
            <div className="relative" style={{paddingBottom: "75%"}}>
                <img {...props} className="absolute object-cover top-0 left-0 w-full h-full"/>
            </div>
        </div>
    )
}

function HomePostItem({pageNode, pageProject, pageUser, thisUser, showAuthor, showProject, ...props}: PublicNodePageProps & HTMLProps<HTMLAnchorElement> & {
    showAuthor?: boolean,
    showProject?: boolean,
}) {
    if (!(pageNode.type === "post" && "publishedTitle" in pageNode.body)) return <></>;

    const {publishedTitle: title, publishedBody: body, publishedDate, urlName} = pageNode.body;

    const isExternal = !!pageNode.shortcutArr;
    const images = findImages(body);
    const firstImage = images[0];
    const showReadingTime = !showAuthor && !showProject;

    return (
        <Link
            href={`${getProjectUrl(pageUser, pageProject)}/p/${urlName}`}
        >
            <a {...props}>
                <div className="sm:flex w-full">
                    {firstImage && (
                        <HomePostImage src={firstImage} className="flex-shrink-0 order-2 sm:pl-8 sm:ml-auto w-full sm:w-40"/>
                    )}
                    <div className="order-1">
                        <h1 className="font-manrope sm:text-xl font-semibold">{title}</h1>
                        <p className="text-gray-400 text-sm leading-relaxed my-2">
                            <LinesEllipsis text={getPlainTextFromSlateValue(body)} maxLine={2}/>
                        </p>
                        <div className="flex items-center flex-wrap text-gray-400 font-manrope text-xs font-semibold my-4">
                            {showAuthor && (
                                <UserButton user={pageUser} className="text-xs mr-3" imageSizeClasses="w-4 h-4"/>
                            )}
                            {showProject && (
                                <InlineButton className="text-xs mr-3" href={getProjectUrl(pageUser, pageProject)}>{pageProject.name}</InlineButton>
                            )}
                            <p className="mr-3">{format(new Date(publishedDate), "MMM d, yyyy")}</p>
                            {showReadingTime && (
                                <p className="mr-3">{Math.ceil(slateWordCount(body) / 200)} min read</p>
                            )}
                            {isExternal && (
                                <ExternalBadge/>
                            )}
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
}

export default React.memo(HomePostItem);