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

export default function HomePostItem({pageNode, pageProject, pageUser, thisUser, ...props}: PublicNodePageProps & HTMLProps<HTMLAnchorElement>) {
    const {publishedTitle: title, publishedBody: body, publishedDate, urlName} = pageNode.body;

    const isExternal = !!pageNode.shortcutArr;
    const images = findImages(body);
    const firstImage = images[0];

    return (
        <Link
            href={`${getProjectUrl(pageUser, pageProject)}/p/${urlName}`}
        >
            <a {...props}>
                <div className="flex">
                    <div>
                        <h1 className="font-manrope sm:text-xl font-semibold">{title}</h1>
                        <p className="text-gray-400 text-sm leading-relaxed my-2">
                            <LinesEllipsis text={getPlainTextFromSlateValue(body)} maxLine={2}/>
                        </p>
                        <div className="flex items-center flex-wrap text-gray-400 font-manrope text-xs font-semibold my-4">
                            <p className="mr-3">{format(new Date(publishedDate), "MMM d, yyyy")}</p>
                            <p className="mr-3">{Math.ceil(slateWordCount(body) / 200)} min read</p>
                            {isExternal && (
                                <ExternalBadge/>
                            )}
                        </div>
                    </div>
                    {firstImage && (
                        <img src={firstImage} className="flex-shrink-0 object-cover ml-8 w-32 h-24"/>
                    )}
                </div>
            </a>
        </Link>
    );
}