import {SessionBase} from "next-auth/_utils";

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
}

export interface ProjectObj {
    urlName: string,
    userId: string, // ID
    name: string,
    description: string,
    stars: string[], // array of IDs
    collaborators: string[],
}

export interface SnippetObj {
    urlName: string,
    projectId: string,
    userId: string, // ID
    type: "snippet" | "resource",
    body: string,
    date: string, // ISO datestring
    url: string,
    tags: string[],
    likes: string[], // array of IDs
}

export interface PostObj {
    urlName: string,
    projectId: string, // ID
    userId: string, // ID
    title: string,
    body: string,
    tags?: string[],
    likes?: string[], // array of IDs
}

export interface ImageObj {
    key: string, // key of S3 object
    userId: string, // ID of user who uploaded the object
    projectId: string, // ID of project that the image belongs to
    attachedUrlName: string, // urlName of associated snippet or post
    attachedType: "post" | "snippet",
    size: number, // size of image in bytes
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
}