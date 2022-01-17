import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import Modal from "react-modal";

export default function UiModal({isOpen, setIsOpen, children, wide = false}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
    wide?: boolean,
}) {
    const ModalClasses = "top-24 left-1/2 fixed bg-white py-4 rounded-md shadow-xl mx-4 p-4";

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={ModalClasses}
            style={{content: {transform: "translateX(calc(-50% - 16px))", maxWidth: "calc(100% - 32px)", width: wide ? 700 : 320}, overlay: {zIndex: 50, backgroundColor: "rgba(0,0,0,0.5)"}}}
        >
            <div className="-mx-4 px-4 overflow-y-auto" style={{maxHeight: "calc(100vh - 192px)"}}>
                {children}
            </div>
        </Modal>
    );
}