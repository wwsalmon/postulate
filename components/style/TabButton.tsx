import Button, {ButtonProps} from "../headless/Button";

export default function TabButton({isActive, ...buttonProps}: ButtonProps & {isActive: boolean}) {
    return (
        <Button
            className={`uppercase font-semibold text-sm tracking-wider flex-shrink-0 mr-6 ${isActive ? "" : "text-gray-400"}`}
            {...buttonProps}
        />
    );
}