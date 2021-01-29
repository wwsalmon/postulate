export function cleanForJSON(input: any): any {
    return JSON.parse(JSON.stringify(input));
}

export const fetcher = url => fetch(url).then(res => res.json());