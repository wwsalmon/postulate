import {DatedObj, PostObjGraph} from "../utils/types";
import ellipsize from "ellipsize";
import readingTime from "reading-time";
import {format} from "date-fns";
import React from "react";
import Link from "next/link";

export default function PostItemCard({post}: {post: DatedObj<PostObjGraph>}) {
    return (
        <div className="border up-border-gray-200 rounded-lg p-4 h-52 shadow-md hover:shadow-xl hover:up-border-gray-700 transition">
            <div className="h-32">
                <p className="font-bold text-sm uppercase up-gray-400">Post {post.privacy !== "public" && `(${post.privacy})`}</p>
                <Link href={`/@${post.authorArr[0].username}/p/${post.urlName}`}>
                    <a>
                        <h3 className="font-medium my-2 content">{ellipsize(post.title, 70)}</h3>
                    </a>
                </Link>
                <p className="up-gray-400">{readingTime(post.body).text}</p>
            </div>
            <div className="mt-6 text-sm">
                <p className="up-gray-500">
                    {format(new Date(post.createdAt), "h:mm a")}
                </p>
            </div>
        </div>
    )
}