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
}

export interface SnippetObj {
    urlName: string,
    projectId: string,
    type: "general" | "update" | "resource",
    body: string,
    date: string, // ISO datestring
    url: string,
    tags: string[],
    likes: string[], // array of IDs
}

export interface PostObj {
    urlName: string,
    projectId: string,
    title: string,
    body: string,
    tags: string[],
    likes: string[], // array of IDs
}

export interface SessionObj extends SessionBase {
    userId: string,
    username: string,
}