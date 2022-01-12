import React, {Fragment, useState} from "react";
import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {cleanForJSON} from "../../../utils/utils";
import {DatedObj, ProjectObj, UserObj} from "../../../utils/types";
import H1 from "../../../components/style/H1";
import H2 from "../../../components/style/H2";
import InlineButton from "../../../components/style/InlineButton";
import SEO from "../../../components/standard/SEO";
import Container from "../../../components/style/Container";
import {Popover, Tab} from "@headlessui/react";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import getThisUser from "../../../utils/getThisUser";
import UiButton from "../../../components/style/UiButton";
import {usePopper} from "react-popper";
import Button from "../../../components/headless/Button";
import {ssr404} from "next-response-helpers";
import {ProjectModel} from "../../../models/project";
import {getProjectPageInfo} from "./new/[type]";

export default function ProjectPage({pageProject, pageUser, thisUser}: { pageProject: DatedObj<ProjectObj>, pageUser: DatedObj<UserObj>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

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
            <Tab.Group>
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
                        <Tab.List className="mt-8 md:mt-0 flex items-center">
                            {["Home", "Posts", "Evergreens", "Sources"].map(tab => (
                                <Tab as={Fragment} key={`project-tab-${tab}`}>
                                    {({selected}) => (
                                        <button className={`uppercase font-semibold text-sm tracking-wider mr-6 ${selected ? "" : "text-gray-400"}`}>
                                            {tab}
                                        </button>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                    </div>
                </div>
                <Tab.Panels>
                    <Tab.Panel>Overview yeet</Tab.Panel>
                    <Tab.Panel>Posts yeet</Tab.Panel>
                    <Tab.Panel>Evergreens yeet</Tab.Panel>
                    <Tab.Panel>Sources yeet</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // fetch project info from MongoDB
    try {
        await dbConnect();

        const pageInfo = await getProjectPageInfo(context);

        if (!pageInfo) return ssr404;

        const {pageUser, pageProject} = pageInfo;

        const thisUser = await getThisUser(context);

        return {
            props: {
                pageProject: cleanForJSON(pageProject),
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                key: context.params.projectUrlName,
            }
        };
    } catch (e) {
        console.log(e);
        return ssr404;
    }
};