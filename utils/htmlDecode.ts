import jsdom from "jsdom";
const { JSDOM } = jsdom;

export default function htmlDecode(input: string): string {
    const dom = new JSDOM(input);
    return dom.window.document.body.textContent;
}