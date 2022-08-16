import Link from "next/link";

export type ButtonProps = (React.HTMLProps<HTMLButtonElement> | React.HTMLProps<HTMLAnchorElement>)
    & {isLoading?: boolean, childClassName?: string, block?: boolean, flex?: boolean};

export default function Button(props: ButtonProps) {
    const {href, isLoading, children, disabled, block} = props;
    let domProps = {...props};
    domProps.className += ` relative text-left ${disabled ? "opacity-25 cursor-not-allowed" : ""}`;
    delete domProps.childClassName;
    delete domProps.block;
    delete domProps.flex;

    return href ? (
        <Link href={href}>
            {/* @ts-ignore */}
            <a {...domProps}>
                <div className={`${block ? "block" : "inline-block"} ${isLoading ? "invisible" : ""} ${props.childClassName || ""} ${props.flex ? "flex items-center" : ""}`}>
                    {children}
                </div>
                {isLoading && <div className="up-spinner"/>}
            </a>
        </Link>
    ) : (
        // @ts-ignore
        <button {...domProps}>
            <div className={`${isLoading ? "invisible " : ""} ${disabled ? "cursor-not-allowed " : ""} ${props.childClassName || ""} ${props.flex ? "flex items-center" : ""}`}>
                {children}
            </div>
            {isLoading && <div className="up-spinner"/>}
        </button>
    )
}