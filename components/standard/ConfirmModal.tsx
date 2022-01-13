import UiModal from "../style/UiModal";
import UiButton from "../style/UiButton";
import {Dispatch, ReactNode, SetStateAction} from "react";

export default function ConfirmModal({isOpen, setIsLoading, isLoading, setIsOpen, onConfirm, children, confirmText, colorClass}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    isLoading: boolean,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    onConfirm: () => any,
    children: ReactNode,
    confirmText: string,
    colorClass?: string
}) {
    return (
        <UiModal
            isOpen={isOpen}
            setIsOpen={(value: boolean) => isLoading ? null : setIsOpen(value)}
        >
            {children}
            <div className="mt-4">
                <UiButton
                    colorClass={colorClass || ""}
                    isLoading={isLoading}
                    onClick={onConfirm}
                >
                    {confirmText}
                </UiButton>
                <UiButton noBg={true} onClick={() => setIsOpen(false)} disabled={isLoading}>
                    Cancel
                </UiButton>
            </div>
        </UiModal>
    );
}