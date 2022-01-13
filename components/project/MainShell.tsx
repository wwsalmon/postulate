import SEO from "../standard/SEO";
import InlineButton from "../style/InlineButton";
import H1 from "../style/H1";
import H2 from "../style/H2";
import {Popover, Tab} from "@headlessui/react";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import React, {Fragment, ReactNode, useState} from "react";
import UiButton from "../style/UiButton";
import Button from "../headless/Button";
import Container from "../style/Container";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import {usePopper} from "react-popper";
import {useRouter} from "next/router";

export default function MainShell({pageProject, pageUser, thisUser, children}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, children: ReactNode }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const {pathname} = useRouter();
    console.log(pathname);
    const pageTab = pathname.split("/")[pathname.split("/").length - 1];

    // popper for "new" dropdown
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const {styles, attributes} = usePopper(referenceElement, popperElement);

    return (
        <Container>
            <SEO title={pageProject.name}/>
            <div className="items-center mb-8 flex">
                <InlineButton href={`/@${pageUser.username}`} light={true}>
                    {pageUser.name}
                </InlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <H1>{pageProject.name}</H1>
                {pageProject.description && (
                    <H2 className="mt-2">{pageProject.description}</H2>
                )}
            </div>
            <div className="my-12 md:flex items-center">
                <div className="ml-auto flex items-center order-2 w-full md:w-auto">
                    <div className="flex items-center">
                        <FiSearch className="mr-4 text-gray-400"/>
                        <input type="text" placeholder="Search" className="w-24 focus:outline-none"/>
                    </div>
                    {isOwner && (
                        <Popover as={Fragment}>
                            {({open}) => (
                                <>
                                    <Popover.Button ref={setReferenceElement} as="div" className="ml-auto md:ml-0">
                                        <UiButton childClassName="flex items-center">
                                            <span className="mr-1">New</span>
                                            <FiChevronDown/>
                                        </UiButton>
                                    </Popover.Button>
                                    <Popover.Panel
                                        ref={setPopperElement}
                                        style={styles.popper} {...attributes.popper}
                                        className="absolute shadow-md rounded-md mt-4 z-10"
                                    >
                                        {["Post", "Evergreen", "Source"].map(type => (
                                            <Button
                                                href={`/@${pageUser.username}/${pageProject.urlName}/new/${type.toLowerCase()}`}
                                                key={`project-new-${type}`}
                                                block={true}
                                                className="px-3 py-2 hover:bg-gray-50 w-full text-left bg-white text-gray-500"
                                            >{type}</Button>
                                        ))}
                                    </Popover.Panel>
                                </>
                            )}
                        </Popover>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {["Home", "Posts", "Evergreens", "Sources"].map(tab => (
                        <Button
                            key={`project-tab-${tab}`}
                            className={`uppercase font-semibold text-sm tracking-wider mr-6 ${((tab.toLowerCase() === pageTab) || (tab === "Home" && pageTab === "[projectUrlName]")) ? "" : "text-gray-400"}`}
                            href={`/@${pageUser.username}/${pageProject.urlName}${tab === "Home" ? "" : "/" + tab.toLowerCase()}`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>
            {children}
        </Container>
    );
}