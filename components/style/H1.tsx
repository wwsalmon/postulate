import {ReactNode} from "react";

export default function H1({children, className}: {children: ReactNode, className?: string}) {
    return (
        <h1 className={`font-manrope text-3xl font-extrabold ${className || ""}`}>{children}</h1>
    )
}