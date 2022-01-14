import {format, subDays} from "date-fns";
import {Node} from "slate";
import {ProjectObj} from "./types";

export function cleanForJSON(input: any): any {
    return JSON.parse(JSON.stringify(input));
}

export const fetcher = url => fetch(url).then(res => res.json());

export const projectWithStatsGraphStages = [
    {
        $lookup: {
            from: "posts",
            let: {projectId: "$_id"},
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {$eq: ["$projectId", "$$projectId"]},
                                {$gte: ["$createdAt", subDays(new Date(), 5 * 7)]},
                            ],
                        }
                    },
                },
                {
                    $group: {
                        _id: {$week: "$createdAt"},
                        count: {$sum: 1},
                    },
                },
            ],
            as: "postsArr",
        },
    },
    {
        $lookup: {
            from: "snippets",
            let: {projectId: "$_id"},
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {$eq: ["$projectId", "$$projectId"]},
                                {$gte: ["$createdAt", subDays(new Date(), 5 * 7)]},
                            ],
                        }
                    },
                },
                {
                    $group: {
                        _id: {$week: "$createdAt"},
                        count: {$sum: 1},
                    },
                },
            ],
            as: "snippetsArr",
        },
    },
];

export const aggregatePipeline = [
    {
        $sort: {
            "updatedAt": -1,
        }
    },
    {
        $lookup: {
            from: "posts",
            let: {"projectId": "$_id"},
            pipeline: [
                { $match:
                        { $expr:
                                { $eq: ["$projectId", "$$projectId"] }
                        }
                },
                { $count: "count" }
            ],
            as: "posts"
        }
    },
    {
        $lookup: {
            from: "snippets",
            let: {"projectId": "$_id"},
            pipeline: [
                { $match:
                        { $expr:
                                { $eq: ["$projectId", "$$projectId"] }
                        }
                },
                { $count: "count" }
            ],
            as: "snippets"
        }
    },
    {
        $lookup: {
            from: "snippets",
            let: {"projectId": "$_id"},
            pipeline: [
                { $match:
                        { $expr:
                                { $and: [
                                        { $eq: ["$projectId", "$$projectId"] },
                                        { $ne: ["$linkedPosts", []] }
                                    ]}
                        }
                },
                { $count: "count" }
            ],
            as: "linkedSnippets"
        }
    },
    ...projectWithStatsGraphStages,
];

export const UserObjWithGraphAggregationPipeline = [
    {$lookup:
            {
                from: "projects",
                let: {"userId": "$_id"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                    ...projectWithStatsGraphStages,
                ],
                as: "projectsArr",
            }
    },
    {
        $lookup: {
            from: "posts",
            let: {"userId": "$_id"},
            pipeline: [
                {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                {$project: {"createdAt": 1}},
            ],
            as: "postsArr",
        }
    },
    {
        $lookup: {
            from: "snippets",
            let: {"userId": "$_id"},
            pipeline: [
                {$match: {$expr: {$eq: ["$userId", "$$userId"]}}},
                {$project: {"createdAt": 1}},
            ],
            as: "snippetsArr",
        }
    },
    {
        $lookup: {
            from: "snippets",
            let: {"userId": "$_id"},
            pipeline: [
                {$match: {$expr: {$and: [
                                {$eq: ["$userId", "$$userId"]},
                                {$ne: ["$linkedPosts", []]},
                            ]}}},
                {$count: "count"},
            ],
            as: "linkedSnippetsArr",
        }
    },
]

export function arrToDict(arr: {createdAt: string}[]): {[key: string]: number} {
    if (!arr) return {};
    return arr
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .reduce((a, b, i, arr) => {
            const thisDate = format(new Date(b.createdAt), "yyyy-MM-dd");
            if (i === 0) {
                a[thisDate] = 1;
                return a;
            } else {
                const lastDate = format(new Date(arr[i - 1].createdAt), "yyyy-MM-dd");
                a[thisDate] = (thisDate === lastDate) ? a[thisDate] + 1 : 1;
                return a;
            }
        }, {});
}

export function arrGraphGenerator(datesObj: {[key: string]: number}, numGraphDays: number) {
    return Array(numGraphDays).fill(0).map((d, i) => {
        const currDate = new Date();
        const thisDate = +currDate - (1000 * 24 * 3600) * (numGraphDays - 1 - i);
        const thisDateFormatted = format(new Date(thisDate), "yyyy-MM-dd");
        return datesObj[thisDateFormatted] || 0;
    })
}

export const slateInitValue: Node[] = [{
    type: "p",
    children: [{text: ""}],
}];

export const getCursorStages = (page?: string, search?: boolean) => {
    let retval = [];
    if (!search) retval.push({$sort: {createdAt: -1}});
    if (page) retval.push({$skip: (+page - 1) * 10}, {$limit: 10});
    return retval;
};

export const findLinks = (nodes: any[]) => {
    let links = [];
    for (let node of nodes) {
        if (node.type === "a") links.push(node.url);
        if (node.children) links.push(...findLinks(node.children));
    }
    return links;
}

export const findImages = (nodes: any[]) => {
    let images = [];
    for (let node of nodes) {
        if (node.type === "img") images.push(node.url);
        if (node.children) images.push(...findImages(node.children));
    }
    return images;
}

export function checkProjectPermission(project: ProjectObj, userId: string) {
    return project.userId.toString() === userId || project.collaborators.map(d => d.toString()).includes(userId);
}