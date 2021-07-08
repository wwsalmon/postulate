import Link from "next/link";
import React from "react";

export default function ProfileSidebarProjectItem({name, href, selected, mobile}: {
    name: string,
    href: string,
    selected: boolean,
    mobile: boolean,
}) {

    return (
        <Link href={href}>
            <a
                className={
                    (selected ? "-ml-4 bg-white border up-border-gray-200" : "up-gray-400") +
                    " " +
                    (mobile ? "border-l-0 rounded-r-lg" : "border-r-0 rounded-l-lg") +
                    " cursor-pointer flex items-center font-medium relative h-12"
                }
                style={{
                    right: mobile ? "auto" : -1,
                    paddingLeft: selected ? "calc(1rem - 1px)" : 0,
                    width: selected ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                }}
            >
                <span className={selected ? "" : "hover:up-bg-gray-100 rounded" + " py-2 px-3 -ml-3"}>{name}</span>
            </a>
        </Link>
    );
}