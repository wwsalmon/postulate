import React, {Fragment, useRef, useState} from "react";
import {GetServerSideProps} from "next";
import dbConnect from "../../../utils/dbConnect";
import {UserModel} from "../../../models/user";
import {ProjectModel} from "../../../models/project";
import {cleanForJSON} from "../../../utils/utils";
import {DatedObj, ProjectObjWithPageStats, UserObj, UserObjWithProjects} from "../../../utils/types";
import H1 from "../../../components/style/H1";
import H2 from "../../../components/style/H2";
import InlineButton from "../../../components/style/InlineButton";
import SEO from "../../../components/standard/SEO";
import Container from "../../../components/style/Container";
import {Popover, Tab, Transition} from "@headlessui/react";
import {FiChevronDown, FiSearch} from "react-icons/fi";
import getThisUser from "../../../utils/getThisUser";
import UiButton from "../../../components/style/UiButton";
import {usePopper} from "react-popper";
import Button from "../../../components/headless/Button";

export default function ProjectPage({projectData, pageUser, thisUser}: { projectData: DatedObj<ProjectObjWithPageStats>, pageUser: DatedObj<UserObjWithProjects>, thisUser: DatedObj<UserObj> }) {
    const isOwner = thisUser && pageUser._id === thisUser._id;

    // popper for "new" dropdown
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const {styles, attributes} = usePopper(referenceElement, popperElement);

    return (
        <Container>
            <SEO title={projectData.name}/>
            <div className="items-center mb-8 flex">
                <InlineButton href={`/@${pageUser.username}`} light={true}>
                    {pageUser.name}
                </InlineButton>
                <span className="mx-2 up-gray-300">/</span>
            </div>
            <div className="mb-12">
                <H1>{projectData.name}</H1>
                {projectData.description && (
                    <H2 className="mt-2">{projectData.description}</H2>
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
    // 404 if not correct url format
    if (
        Array.isArray(context.params.username) ||
        Array.isArray(context.params.projectUrlName) ||
        context.params.username.substr(0, 1) !== "@"
    ) {
        return {notFound: true};
    }

    // parse URL params
    const username: string = context.params.username.substr(1);
    const projectUrlName: string = context.params.projectUrlName;

    // fetch project info from MongoDB
    try {
        await dbConnect();

        const userArr = await UserModel.aggregate([
            {$match: {username: username}},
            {
                $lookup:
                    {
                        from: "projects",
                        foreignField: "userId",
                        localField: "_id",
                        as: "projectsArr",
                    }
            },
        ]);

        if (!userArr.length) return {notFound: true};

        const pageUser = userArr[0];

        const projectData = await ProjectModel.aggregate([
            {$match: {userId: pageUser._id, urlName: projectUrlName}},
            {
                $lookup: {
                    from: "posts",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "postsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$projectId", "$$projectId"]}}},
                        {$project: {"createdAt": 1}},
                    ],
                    as: "snippetsArr",
                }
            },
            {
                $lookup: {
                    from: "snippets",
                    let: {"projectId": "$_id"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ["$projectId", "$$projectId"]},
                                        {$ne: ["$linkedPosts", []]},
                                    ]
                                }
                            }
                        },
                        {$count: "count"},
                    ],
                    as: "linkedSnippetsArr",
                }
            },
        ]);

        if (!projectData.length) return {notFound: true};

        const thisUser = await getThisUser(context);

        return {
            props: {
                projectData: cleanForJSON(projectData[0]),
                pageUser: cleanForJSON(pageUser),
                thisUser: cleanForJSON(thisUser),
                key: projectUrlName,
            }
        };
    } catch (e) {
        console.log(e);
        return {notFound: true};
    }
};