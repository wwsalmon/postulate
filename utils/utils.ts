import {ToolbarDropdownIcon, ToolbarIcon} from "easymde";
import {format} from "date-fns";
import {Node} from "slate";

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
    // @ts-ignore doesn't recognize "type" property in Node
    type: "p",
    children: [{text: ""}],
    id: 0,
}];