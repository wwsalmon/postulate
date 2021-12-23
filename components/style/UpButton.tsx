import {ReactNode} from "react";
import Link from "next/link";

interface UpButtonPropsBase {
    children: ReactNode,
    small?: boolean,
    primary?: boolean,
    text?: boolean,
    isExtension?: boolean,
    className?: string,
}

interface UpButtonPropsLink extends UpButtonPropsBase {
    href: string,
    onClick?: never,
}

interface UpButtonPropsButton extends UpButtonPropsBase {
    href?: never,
    onClick: () => any,
}

type UpButtonProps = UpButtonPropsLink | UpButtonPropsButton;

export default function UpButton({children, isExtension, small, primary, text, href, onClick, className}: UpButtonProps) {
    const classNames = `up-button ${small ? "small" : ""} ${primary ? "primary" : ""} ${text ? "text" : ""} ${className || ""}`;

    return href ? isExtension ? (
        <a href={href} className={classNames}>{children}</a>
    ) : (
        <Link href={href}>
            <a className={classNames}>{children}</a>
        </Link>
    ) : (
        <button className={classNames} onClick={onClick}>{children}</button>
    );
}