import {format, subDays} from "date-fns";
import {Node} from "slate";
import {ProjectObj} from "./types";

export function cleanForJSON(input: any): any {
    return JSON.parse(JSON.stringify(input));
}

export const fetcher = url => fetch(url).then(res => res.json());

export const slateInitValue: Node[] = [{
    type: "p",
    children: [{text: ""}],
}];

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