import {ReactNode} from "react";
import Link from "next/link";

export default function MoreMenuItem({href, onClick, disabled = false, icon = null, text}: {
    href?: string,
    onClick?: () => any,
    disabled?: boolean,
    icon?: ReactNode,
    text: string,
}) {
    const MoreMenuItemClasses = "h-12 flex items-center hover:bg-gray-50 px-4 w-full";
    const MoreMenuItemDisabledClasses = " opacity-50 cursor-not-allowed hover:bg-white"

    return href ? (
        <Link href={href}>
            <a className={MoreMenuItemClasses + (disabled ? MoreMenuItemDisabledClasses : "")}>
                {icon}
                <span className={"whitespace-nowrap " + (icon ? "ml-4" : "")}>{text}</span>
            </a>
        </Link>
    ) : (
        <button
            className={MoreMenuItemClasses + (disabled ? MoreMenuItemDisabledClasses : "")}
            disabled={disabled}
            onClick={onClick}
        >
            {icon}
            <span className={"whitespace-nowrap " + (icon ? "ml-4" : "")}>{text}</span>
        </button>
    );
}