import React, {ReactNode} from "react";

export default function Banner(props: {children: ReactNode, className?: string}) {
    return (
        <div className={"px-4 py-2 rounded-md border border-gray-300 flex items-center bg-gray-100 " + (props.className || "")}>
            {props.children}
        </div>
    )
}