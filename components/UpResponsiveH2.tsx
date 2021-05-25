import {ReactNode} from "react";

export default function UpResponsiveH2({children, className}: { children: ReactNode, className?: string }) {
    return (
        <h2 className={"up-font-display text-2xl sm:text-3xl lg:text-4xl " + (className || "")}>{children}</h2>
    );
}