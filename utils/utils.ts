import {ToolbarDropdownIcon, ToolbarIcon} from "easymde";

export function cleanForJSON(input: any): any {
    return JSON.parse(JSON.stringify(input));
}

export const fetcher = url => fetch(url).then(res => res.json());

// taken directly from type file bc I couldn't find an import
type ToolbarButton =
    'bold'
    | 'italic'
    | 'quote'
    | 'unordered-list'
    | 'ordered-list'
    | 'link'
    | 'image'
    | 'strikethrough'
    | 'code'
    | 'table'
    | 'redo'
    | 'heading'
    | 'undo'
    | 'heading-bigger'
    | 'heading-smaller'
    | 'heading-1'
    | 'heading-2'
    | 'heading-3'
    | 'clean-block'
    | 'horizontal-rule'
    | 'preview'
    | 'side-by-side'
    | 'fullscreen'
    | 'guide';

export const simpleMDEToolbar: ReadonlyArray<"|" | ToolbarButton | ToolbarIcon | ToolbarDropdownIcon> = ["bold", "italic", "|", "heading-1", "heading-2", "heading-3", "|", "link", "quote", "unordered-list", "ordered-list", "|", "preview", "guide"]

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
    }
];