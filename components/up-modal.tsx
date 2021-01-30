import {Dispatch, ReactNode, SetStateAction} from 'react';
import Modal from "react-modal";

export default function UpModal({isOpen, setIsOpen, children}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}) {
    const ModalClasses = "max-w-sm z-50 top-24 left-1/2 fixed bg-white p-4 rounded-md shadow-xl";

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={ModalClasses}
            style={{content: {transform: "translateX(-50%)"}}}
        >
            {children}
        </Modal>
    );
}