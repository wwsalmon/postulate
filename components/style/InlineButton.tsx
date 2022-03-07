import React, {ReactNode} from "react";
import Button from "../headless/Button";

interface BaseProps {
    children: ReactNode;
    className?: string,
    childClassName?: string,
    light?: boolean,
    dark?: boolean,
    flex?: boolean,
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

export default function InlineButton({href, onClick, children, className, childClassName, light, dark, flex}: ButtonOrLinkProps) {
    const classNames = `inline-block font-medium py-1 px-2 -mx-2 rounded-md transition truncate ${dark ? "text-white text-opacity-50 hover:up-bg-blue" : `hover:text-gray-700 hover:bg-gray-100 ${light ? "text-gray-400" : "text-gray-500"}`} ${className || ""}`;
    let buttonProps = {flex: !!flex, childClassName: childClassName};
    if (href) buttonProps["href"] = href;
    else buttonProps["onClick"] = onClick;

    return <Button className={classNames} {...buttonProps}>{children}</Button>;
}