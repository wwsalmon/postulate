import {Dispatch, ReactNode, SetStateAction} from 'react';
import Modal from "react-modal";

export default function UpModal({isOpen, setIsOpen, children, wide = false}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
    wide?: boolean,
}) {
    const ModalClasses = "top-24 left-1/2 fixed bg-white p-4 rounded-md shadow-xl" + (wide ? " max-w-2xl" : " max-w-sm");

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={ModalClasses}
            style={{content: {transform: "translateX(-50%)"}, overlay: {zIndex: 20}}}
        >
            {children}
        </Modal>
    );
}