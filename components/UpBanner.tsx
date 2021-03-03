import React, {ReactNode} from "react";

export default function UpBanner(props: {children: ReactNode, className?: string}) {
    return (
        <div className={"p-4 rounded-md border md:flex items-center bg-gray-50 " + (props.className || "")}>
            {props.children}
        </div>
    )
}