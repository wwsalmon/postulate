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
    bio: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export interface ProjectObj {
    userId: string, // ID
    name: string,
    description: string,
    stars: string[], // array of IDs
}

export interface SnippetObj {
    projectId: string,
    type: "general" | "update" | "resource",
    body: string,
    date: string, // ISO datestring
    url: string,
    tags: string[],
    likes: string[], // array of IDs
}

export interface PostObj {
    projectId: string,
    title: string,
    body: string,
    tags: string[],
    likes: string[], // array of IDs
}