import {ReactNode} from "react";

export default function H4({children, className}: { children: ReactNode, className?: string }) {
    return (
        <h4 className={"font-medium content leading-tight " + (className || "")}>
            {children}
        </h4>
    );
}