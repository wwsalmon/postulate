import Link from "next/link";
import Button, {ButtonProps} from "../headless/Button";

export default function UiButton(props: ButtonProps) {
    let buttonProps = {...props};
    buttonProps.className += " bg-upBlue-500 text-white text-sm py-2 px-3 font-medium rounded-md";

    return (
        <Button {...buttonProps}>{props.children}</Button>
    )
}