import React from 'react';
import {DatedObj, PostObj, ProjectObj, UserObj} from "../utils/types";
import Link from "next/link";
import {format} from "date-fns";
import readingTime from "reading-time";

export default function PublicPostItem({post, author, project = null, urlPrefix}: {
    post: DatedObj<PostObj>,
    author: DatedObj<UserObj>,
    project?: DatedObj<ProjectObj>,
    urlPrefix: string,
}) {
    return (
        <div className="opacity-75 hover:opacity-100 transition" key={post._id}>
            <Link href={`${urlPrefix}/${post.urlName}`}>
                <a>
                    <p className="up-ui-item-title mb-2">{post.title}</p>
                    <p>
                        <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                        <span className="opacity-50"> | {readingTime(post.body).text}</span>
                    </p>
                </a>
            </Link>
            {project ? (
                <Link href={`${urlPrefix}`}>
                    <a className="block mt-4 opacity-50 hover:opacity-75 transition underline">
                        {project.name}
                    </a>
                </Link>
            ) : (
                <Link href={`/@${author.username}`}>
                    <a>
                        <div className="mt-4 flex items-center opacity-50 hover:opacity-75 transition">
                            <img src={author.image} alt={`Profile picture of ${author.name}`} className="w-8 h-8 rounded-full mr-4"/>
                            <div>
                                <p className="font-bold">{author.name}</p>
                            </div>
                        </div>
                    </a>
                </Link>
            )}
            <hr className="my-10"/>
        </div>
    );
}