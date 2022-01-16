import React, {Fragment, ReactNode, useState} from "react";
import {Popover} from "@headlessui/react";
import Button, {ButtonProps} from "./Button";
import {usePopper} from "react-popper";
import {FiMoreVertical} from "react-icons/fi";

export function MoreMenu({children, button, className}: {children: ReactNode, button: ReactNode, className?: string}) {
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const {styles, attributes} = usePopper(referenceElement, popperElement, {modifiers: [{name: "offset", options: {offset: [0, 16]}}]});

    return (
        <Popover as={Fragment}>
            <Popover.Button ref={setReferenceElement} as="div" className={className || ""}>
                {button}
            </Popover.Button>
            <Popover.Panel
                ref={setPopperElement}
                style={styles.popper} {...attributes.popper}
                className="absolute shadow-md rounded-md z-10"
            >
                {children}
            </Popover.Panel>
        </Popover>
    );
}

export function MoreMenuItem(props: ButtonProps) {
    let buttonProps = {...props};
    buttonProps.className += ` px-3 py-2 hover:bg-gray-50 bg-white text-gray-500`;
    if (props.onClick) buttonProps.className += ` w-full`;

    return (
        <Button block={true} {...buttonProps}>{props.children}</Button>
    )
}

export function MoreMenuButton() {
    return (
        <button className="hover:bg-gray-100 p-2 rounded-md"><FiMoreVertical/></button>
    )
}