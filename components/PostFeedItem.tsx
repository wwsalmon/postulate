import {DatedObj, PostObjGraph} from "../utils/types";
import Link from "next/link";
import H3 from "./style/H3";
import React, {ReactNode} from "react";
import {findImages} from "../utils/utils";
import {format} from "date-fns";
import readingTime from "reading-time";

export default function PostFeedItem({post, className, i}: { post: DatedObj<PostObjGraph>, className?: string, i?: number }) {
    const images = findImages(post.slateBody);
    const author = post.authorArr[0];
    const project = post.projectArr[0];
    const owner = project.ownerArr[0];

    const LinkWrapper = ({children, className}: {children: ReactNode, className?: string}) => (
        <Link href={`/@${author.username}/p/${post.urlName}`}>
            <a className={(className || "")}>
                {children}
            </a>
        </Link>
    )

    return (
        <div className={"w-1/2 px-8 inline-block mb-12 " + (className || "")}>
            {!(i === 0 || i === 1) && (
                <hr className="up-border-gray-400 mb-12"/>
            )}
            <LinkWrapper>
                <h3 className="up-font-display font-medium" style={{fontSize: 22}}>{post.title}</h3>
            </LinkWrapper>
            {!!images.length ? (
                <LinkWrapper>
                    <img
                        src={images[0]}
                        alt="First image in post"
                        className="my-8 opacity-75 hover:opacity-100 transition shadow"
                    />
                </LinkWrapper>
            ) : (
                <LinkWrapper>
                    <p className="my-4 leading-relaxed up-gray-400 break-words">{post.body.substr(0, 200)}</p>
                </LinkWrapper>
            )}
            <div className="flex items-center mt-4">
                <div>
                    <p className="up-gray-300">
                        {format(new Date(post.createdAt), "MMMM d, yyyy")}
                    </p>
                </div>
                <LinkWrapper className="ml-auto">
                    <p className="up-gray-300 font-medium">{readingTime(post.body).text} ></p>
                </LinkWrapper>
            </div>
        </div>
    );
}