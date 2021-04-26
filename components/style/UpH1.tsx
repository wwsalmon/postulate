import {ReactNode} from "react";

export default function UpH1({children, className}: {children: ReactNode, className?: string}) {
    return (
        <h1 className={`up-h1 ${className || ""}`}>{children}</h1>
    )
}