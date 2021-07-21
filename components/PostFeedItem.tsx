import {DatedObj, PostObjGraph, PostObjWithAuthor} from "../utils/types";
import Link from "next/link";
import React, {ReactNode} from "react";
import {findImages} from "../utils/utils";
import {format} from "date-fns";
import readingTime from "reading-time";
import UpInlineButton from "./style/UpInlineButton";

function ProjectButtonsList({post, projectId, top}: { post: DatedObj<PostObjGraph>, projectId: string, top?: boolean, }) {
    return (
        <div className="flex items-center">
            <span className={`${top ? "mx-2" : "mr-2"} up-gray-300`}>{top ? "in" : projectId ? "Also in" : "In"}</span>
            {post.projectArr.filter(project => project._id !== projectId).map((project, i) => (
                <>
                    {i !== 0 && (
                        <span className="mx-2 up-gray-300">and</span>
                    )}
                    <UpInlineButton
                        light={true}
                        href={`/@${project.ownerArr[0].username}/${project.urlName}`}
                    >{project.name}</UpInlineButton>
                </>
            ))}
        </div>
    )
}

export default function PostFeedItem({post, projectId, className, i, notFeed, showAuthor}: {
    post: DatedObj<PostObjGraph>,
    projectId?: string,
    className?: string,
    i?: number,
    notFeed?: boolean,
    showAuthor?: boolean,
}) {
    const images = findImages(post.slateBody);
    const author = post.authorArr[0];

    const LinkWrapper = ({children, className}: {children: ReactNode, className?: string}) => (
        <Link href={`/@${author.username}/p/${post.urlName}`}>
            <a className={(className || "")}>
                {children}
            </a>
        </Link>
    )

    return (
        <div className={notFeed ? "mb-12" : "md:w-1/2 md:px-6 inline-block mb-12 " + (className || "")}>
            {i === 1 && !notFeed && (
                <hr className="up-border-gray-400 mb-12 md:hidden"/>
            )}
            {!(i === 0 || (i === 1 && !notFeed)) && (
                <hr className="up-border-gray-400 mb-12"/>
            )}
            <LinkWrapper>
                <h3 className="up-font-display font-medium" style={{fontSize: 22}}>{post.title}</h3>
            </LinkWrapper>
            {showAuthor && (
                <div className="flex items-center">
                    <UpInlineButton href={`/@${post.authorArr[0].username}`} className="inline-flex items-center mt-2 mb-2" light={true}>
                        <img src={post.authorArr[0].image} alt={`Profile picture of ${post.authorArr[0].name}`} className="w-6 h-6 rounded-full"/>
                        <p className="ml-3">{post.authorArr[0].name}</p>
                    </UpInlineButton>
                    <ProjectButtonsList post={post} projectId={projectId} top={true}/>
                </div>
            )}
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
                    <p className="my-4 leading-relaxed up-gray-400 break-words">{post.body.substr(0, 200)}...</p>
                </LinkWrapper>
            )}
            <div className="flex items-center mt-4">
                <div>
                    <p className="up-gray-300">
                        {format(new Date(post.createdAt), "MMMM d, yyyy")}
                    </p>
                    {!showAuthor && !!post.projectArr.filter(project => project._id !== projectId).length && (
                        <ProjectButtonsList post={post} projectId={projectId}/>
                    )}

                </div>
                <LinkWrapper className="ml-auto">
                    <p className="up-gray-300 font-medium">{readingTime(post.body).text} &gt;</p>
                </LinkWrapper>
            </div>
        </div>
    );
}