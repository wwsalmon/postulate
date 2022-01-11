import {BaseEditor, Descendant} from "slate";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";

export type CustomElement = {
    type: string,
    children: Descendant[],
    src?: string,
    href?: string,
}

export type CustomText = {
    bold?: boolean
    italic?: boolean
    code?: boolean
    text: string
}

export type EmptyText = {
    text: string
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module "slate" {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText | EmptyText
    }
}