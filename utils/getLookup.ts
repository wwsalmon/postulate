export default function getLookup(from: string, foreignField: string, localField: string, as: string) {
    return {$lookup: {from, foreignField, localField, as}};
}