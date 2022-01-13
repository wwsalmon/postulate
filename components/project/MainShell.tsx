import SEO from "../standard/SEO";
import InlineButton from "../style/InlineButton";
import H1 from "../style/H1";
import H2 from "../style/H2";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import React, {ReactNode} from "react";
import UiButton from "../style/UiButton";
import Button from "../headless/Button";
import Container from "../style/Container";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";
import {useRouter} from "next/router";
import {MoreMenu, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";

export default function MainShell({pageProject, pageUser, thisUser, children}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj>, children: ReactNode }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const {pathname} = useRouter();
    console.log(pathname);
    const pageTab = pathname.split("/")[pathname.split("/").length - 1];

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
                <div className="ml-auto flex items-center order-2 w-full md:w-auto mb-6 md:mb-0">
                    <div className="flex items-center">
                        <FiSearch className="mr-4 text-gray-400"/>
                        <input type="text" placeholder="Search" className="w-24 focus:outline-none"/>
                    </div>
                    {isOwner && (
                        <MoreMenu
                            button={(
                                <UiButton childClassName="flex items-center">
                                    <span className="mr-1">New</span>
                                    <FiChevronDown/>
                                </UiButton>
                            )}
                            className="ml-auto md:ml-0"
                        >
                            {["Post", "Evergreen", "Source"].map(type => (
                                <MoreMenuItem
                                    href={`${getProjectUrl(pageUser, pageProject)}/new/${type.toLowerCase()}`}
                                    key={`project-new-${type}`}
                                    block={true}
                                >
                                    {type}
                                </MoreMenuItem>
                            ))}
                        </MoreMenu>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {["Home", "Posts", "Evergreens", "Sources"].map(tab => (
                        <Button
                            key={`project-tab-${tab}`}
                            className={`uppercase font-semibold text-sm tracking-wider mr-6 ${((tab.toLowerCase() === pageTab) || (tab === "Home" && pageTab === "[projectUrlName]")) ? "" : "text-gray-400"}`}
                            href={`${getProjectUrl(pageUser, pageProject)}${tab === "Home" ? "" : "/" + tab.toLowerCase()}`}
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