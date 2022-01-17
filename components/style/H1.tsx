import {ReactNode} from "react";

export default function H1({children, className, small}: {children: ReactNode, className?: string, small?: boolean}) {
    return (
        <h1 className={`font-manrope ${small ? "text-2xl" : "text-3xl"} font-extrabold leading-snug ${className || ""}`}>{children}</h1>
    )
}