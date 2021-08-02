import Link from "next/link";
import React, {ReactNode} from "react";

interface BaseProps {
    children: ReactNode;
    className?: string,
    light?: boolean,
    dark?: boolean,
}

interface ButtonProps extends BaseProps {
    href?: never,
    onClick: (any) => any,
}

interface LinkProps extends BaseProps {
    href: string,
    onClick?: never,
}

type ButtonOrLinkProps = ButtonProps | LinkProps;

export default function UpInlineButton({href, onClick, children, className, light, dark}: ButtonOrLinkProps) {
    const classNames = "inline-block font-medium py-1 px-2 -mx-2 rounded-md transition truncate " + (dark ? "text-white text-opacity-50 hover:up-bg-blue" : ("hover:up-gray-700 hover:up-bg-gray-100 " + (light ? "up-gray-400" : "up-gray-500"))) + " " + (className || "");

    return href ? (
        <Link href={href}>
            <a className={classNames}>
                {children}
            </a>
        </Link>
    ) : (
        <button onClick={onClick} className={classNames}>
            {children}
        </button>
    );
}