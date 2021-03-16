import {ReactNode} from "react";
import Link from "next/link";

export default function MoreMenuItem({href, onClick, disabled = false, icon = null, text, className = "", wrapText}: {
    href?: string,
    onClick?: () => any,
    disabled?: boolean,
    icon?: ReactNode,
    text: string | ReactNode,
    className?: string,
    wrapText?: boolean,
}) {
    const MoreMenuItemClasses = "flex items-center hover:bg-gray-50 px-4 w-full " + (wrapText ? "text-left py-2" : "h-12");
    const MoreMenuItemDisabledClasses = " opacity-50 cursor-not-allowed hover:bg-white"

    return href ? (
        <Link href={href}>
            <a className={MoreMenuItemClasses + (disabled ? MoreMenuItemDisabledClasses : "") + " " + className}>
                {icon}
                <span className={(wrapText ? "" : "whitespace-nowrap ") + (icon ? "ml-4" : "")}>{text}</span>
            </a>
        </Link>
    ) : (
        <button
            className={MoreMenuItemClasses + (disabled ? MoreMenuItemDisabledClasses : "") + " " + className}
            disabled={disabled}
            onClick={onClick}
        >
            {icon}
            <span className={(wrapText ? "" : "whitespace-nowrap ") + (icon ? "ml-4" : "")}>{text}</span>
        </button>
    );
}