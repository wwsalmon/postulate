import Link from "next/link";
import React, {ReactNode} from "react";

interface BaseProps {
    children: ReactNode;
    className?: string,
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

export default function UpInlineButton({href, onClick, children, className}: ButtonOrLinkProps) {
    const classNames = "inline-block up-gray-500 font-medium hover:up-gray-700 hover:up-bg-gray-50 py-1 px-2 -mx-2 rounded-md transition " + (className || "");

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