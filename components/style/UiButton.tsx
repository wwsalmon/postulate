import Link from "next/link";
import Button, {ButtonProps} from "../headless/Button";

export default function UiButton(props: ButtonProps & {colorClass?: string, noBg?: boolean}) {
    let buttonProps = {...props};
    buttonProps.className += ` transition ${props.noBg ? "" : (props.colorClass || "bg-upBlue-500 hover:bg-upBlue-700")} ${props.noBg ? "hover:bg-gray-100" : "text-white"}  text-sm py-2 px-3 font-medium rounded-md`;

    return (
        <Button {...buttonProps}>{props.children}</Button>
    )
}