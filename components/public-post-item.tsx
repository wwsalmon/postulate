import React from 'react';
import {DatedObj, PostObj, PostObjGraph, ProjectObj, UserObj} from "../utils/types";
import Link from "next/link";
import {format} from "date-fns";
import readingTime from "reading-time";
import UpInlineButton from "./style/UpInlineButton";
import {findImages} from "../utils/utils";

export default function PublicPostItem({post, showProject, showAuthor, showLine = true}: {
    post: DatedObj<PostObjGraph>,
    showProject?: boolean,
    showAuthor?: boolean,
    showLine?: boolean,
}) {
    const images = findImages(post.slateBody);
    const author = post.authorArr[0];
    const project = post.projectArr[0];
    const owner = project.ownerArr[0];

    return (
        <div className="w-full" key={post._id}>
            <div className="flex items-center">
                <div>
                    <div className="md:hidden flex items-center mb-4 flex-wrap">
                        <span className="up-gray-400">{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                        <span className="mx-2 up-gray-300">|</span>
                        <span className="up-gray-400">{readingTime(post.body).text}</span>
                    </div>
                    <Link href={`/@${author.username}/p/${post.urlName}`}>
                        <a>
                            <h3 className="up-ui-item-title mb-4">{post.title}</h3>
                        </a>
                    </Link>
                    <div className="flex items-center flex-wrap">
                        {showAuthor && (
                            <UpInlineButton href={`/@${author.username}`}>
                                <div className="flex items-center">
                                    <img src={author.image} alt={`Profile picture of ${author.name}`} className="w-6 h-6 rounded-full mr-3 opacity-75"/>
                                    <div>
                                        <span>{author.name}</span>
                                    </div>
                                </div>
                            </UpInlineButton>
                        )}
                        {showProject && (
                            <>
                                {showAuthor && (
                                    <span className="up-gray-400 mx-2">in</span>
                                )}
                                <UpInlineButton
                                    href={`/@${owner.username}/${project.urlName}`}
                                >
                                    {project.name}
                                </UpInlineButton>
                            </>
                        )}
                        {!!images.length && (
                            <>
                                {(showAuthor || showProject) && (
                                    <span className="up-gray-400 mx-2 hidden md:block">on</span>
                                )}
                                <span className="up-gray-400 hidden md:block">{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                            </>
                        )}
                        {!!post.tags.length && (
                            <>
                                {(showAuthor || showProject) && (
                                    <span className="up-gray-300 mx-2">|</span>
                                )}
                                {post.tags.map(tag => (
                                    <button className="up-gray-500 font-bold">#{tag} </button>
                                ))}
                            </>
                        )}
                        {!!images.length && (
                            <>
                                <span className="up-gray-300 mx-2 hidden md:block">|</span>
                                <span className="up-gray-400 hidden md:block">{readingTime(post.body).text}</span>
                            </>
                        )}
                    </div>
                </div>
                {images.length ? (
                    <Link href={`/@${author.username}/p/${post.urlName}`}>
                        <a className="w-32 pl-6 flex-shrink-0 block ml-auto">
                            <img className="max-w-full shadow-md max-h-48" src={images[0]} alt="Preview image for post"/>
                        </a>
                    </Link>
                ) : (
                    <div className={`ml-auto flex-shrink-0 text-right pl-6 hidden md:block`}>
                        <p>{format(new Date(post.createdAt), "MMMM d, yyyy")}</p>
                        <p className="up-gray-400">{readingTime(post.body).text}</p>
                    </div>
                )}
            </div>
            {showLine && (
                <hr className="my-12"/>
            )}
        </div>
    );
}