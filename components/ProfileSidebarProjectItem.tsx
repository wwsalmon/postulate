import Link from "next/link";
import React from "react";

export default function ProfileSidebarProjectItem({name, href, selected}: {
    name: string,
    href: string,
    selected: boolean,
}) {
    return (
        <Link href={href}>
            <a
                className={(selected ? "-ml-4 bg-white border rounded-l-lg up-border-gray-200 border-r-0 " : "up-gray-400 ") + "cursor-pointer flex items-center font-medium relative h-12"}
                style={{
                    right: -1,
                    paddingLeft: selected ? "calc(1rem - 1px)" : 0,
                    width: selected ? "calc(100% + 1px + 1rem)" : "calc(100% + 1px)"
                }}
            >
                <span className={selected ? "" : "hover:up-bg-gray-100 rounded" + " py-2 px-3 -ml-3"}>{name}</span>
            </a>
        </Link>
    );
}