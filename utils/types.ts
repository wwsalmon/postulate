import {Node} from "slate";

export interface WaitlistAPIRes {
    data: {
        current_priority: number,
        referral_link: string,
        registered_email: string,
        total_referrals: number,
        total_users: number,
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
}

export interface ProjectObj {
    urlName: string,
    userId: string, // ID
    name: string,
    description: string,
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

export interface ImageObj {
    key: string, // key of S3 object
    userId: string, // ID of user who uploaded the object
    size: number, // size of image in bytes
}

// NODE TYPES

export type NodeTypes = "post" | "evergreen" | "source";

interface NodeObjBase {
    projectId: string,
    userId: string,
}

interface PublicBody {
    urlName: string,
    publishedDate: string,
    lastPublishedDate: string,
}

interface SourceBody {
    title: string,
    link: string,
    notes: Node[],
    summary: Node[],
    takeaways: Node[],
}

interface SourceBodyPublic extends SourceBody, PublicBody {
    publishedTitle: string,
    publishedLink: string,
    publishedNotes: Node[],
    publishedSummary: Node[],
    publishedTakeaways: Node[],
}

interface NodeObjSource extends NodeObjBase {
    type: "source",
    body: SourceBody | SourceBodyPublic,
}

interface PostOrEvergreenBody {
    title: string,
    body: Node[],
}

interface PostOrEvergreenBodyPublic extends PostOrEvergreenBody, PublicBody {
    publishedTitle: string,
    publishedBody: Node[],
}

interface NodeObjPostOrEvergreen extends NodeObjBase {
    type: "post" | "evergreen",
    body: PostOrEvergreenBody | PostOrEvergreenBodyPublic,
}

export type NodeObj = NodeObjPostOrEvergreen | NodeObjSource;

export interface NodeObjSourcePublic extends NodeObjBase {
    type: "source",
    body: SourceBodyPublic,
}

export interface NodeObjPostOrEvergreenPublic extends NodeObjBase {
    type: "post" | "evergreen",
    body: PostOrEvergreenBodyPublic,
}

export type NodeObjPublic = NodeObjSourcePublic | NodeObjPostOrEvergreenPublic;

// END NODE TYPES

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