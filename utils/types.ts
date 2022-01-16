import {SessionBase} from "next-auth/_utils";
import {Node} from "slate";
import {ReactNode} from "react";

export interface WaitlistAPIRes {
    data: {
        current_priority: number,
        referral_link: string,
        registered_email: string,
        total_referrals: number,
        total_waiters_currently: number,
        user_id: string,
    }
}

export interface UserObj {
    email: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    featuredProjects: string[], // array of IDs
    featuredPosts: string[], // array of IDs
}

export interface ProjectObj {
    urlName: string,
    userId: string, // ID
    name: string,
    description: string,
    stars: string[], // array of IDs
    collaborators: string[],
    availableTags: string[],
}

export interface UserObjWithProjects extends UserObj {
    projectsArr: DatedObj<ProjectObjWithStats>[],
}

export interface UserObjGraph extends UserObjWithProjects {
    postsArr: {createdAt: string}[],
    snippetsArr: {createdAt: string}[],
    linkedSnippetsArr: {count: number}[],
}

export interface ProjectObjWithOwnerWithProjects extends ProjectObj {
    ownerArr: DatedObj<UserObjWithProjects>[],
}

export interface ProjectObjWithPageStats extends ProjectObj {
    postsArr: {createdAt: string}[],
    snippetsArr: {createdAt: string}[],
    linkedSnippetsArr: {count: number}[],
}

export interface ProjectObjWithStats extends ProjectObj {
    postsArr: {
        _id: number,
        count: number,
    }[],
    snippetsArr: {
        _id: number,
        count: number,
    }[],
}

export interface ProjectObjWithCounts extends ProjectObjWithStats {
    posts: {count: number}[],
    snippets: {count: number}[],
    linkedSnippets: {count: number}[],
}

export interface SnippetObj {
    projectId: string,
    userId: string, // ID
    slateBody: Node[],
}

export type privacyTypes = "public" | "private" | "unlisted" | "draft";

export interface PostObj {
    urlName: string,
    projectId: string, // ID
    projectIds: string[], // ID[]
    userId: string, // ID
    title: string,
    body: string,
    slateBody?: Node[],
    tags?: string[],
    privacy: privacyTypes,
}

export interface PostObjWithAuthor extends PostObj {
    authorArr: DatedObj<UserObj>[],
}

export interface ImageObj {
    key: string, // key of S3 object
    userId: string, // ID of user who uploaded the object
    projectId: string, // ID of project that the image belongs to
    attachedUrlName: string, // urlName of associated snippet or post
    attachedType: "post" | "snippet",
    size: number, // size of image in bytes
}
export interface ReactionObj {
    userId: string,
    targetId: string,
}

export interface CommentObj {
    userId: string,
    targetId: string,
    parentCommentId: string,
    body: string,
}

export interface NotificationObj {
    userId: string,
    type: "postReaction" | "postComment" | "postCommentReply",
    targetId: string, // ID of relevant object, i.e. a reaction or comment
    read: boolean,
}

export interface NotificationWithAuthorAndTarget extends NotificationObj {
    comment: (DatedObj<CommentObj> & {post: DatedObj<PostObjWithAuthor>[], authorArr: DatedObj<UserObj>[]})[],
    reaction: (DatedObj<ReactionObj> & {post: DatedObj<PostObjWithAuthor>[], authorArr: DatedObj<UserObj>[]})[],
}

interface LinkObjBase {
    nodeType: "post" | "snippet",
    nodeId: string,
}

interface LinkObjTargetUrl extends LinkObjBase {
    targetType: "url",
    targetUrl: string,
    targetId?: never,
}

interface LinkObjTargetItem extends LinkObjBase {
    targetType: "post" | "snippet",
    targetId: string,
    targetUrl?: never,
}

export type LinkObj = LinkObjTargetUrl | LinkObjTargetItem;

export type NodeTypes = "snippet" | "post" | "evergreen" | "source";

export interface NodeObj {
    projectId: string,
    userId: string,
    body: any,
    type: NodeTypes,
}

export interface ShortcutObj {
    projectId: string,
    userId: string,
    targetId: string, // ObjectId
    urlName: string,
    type: NodeTypes,
}

// generic / type alias from https://stackoverflow.com/questions/26652179/extending-interface-with-generic-in-typescript
export type DatedObj<T extends {}> = T & {
    _id: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export interface SessionObj extends SessionBase {
    userId: string,
    username: string,
    featuredProjects: string[],
}