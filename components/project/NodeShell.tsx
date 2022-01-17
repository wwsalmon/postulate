import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import SEO from "../standard/SEO";
import PublicNavbar from "./PublicNavbar";
import NodeInner from "./NodeInner";
import {Tab} from "@headlessui/react";
import {Fragment} from "react";
import NodeFeed from "./NodeFeed";
import getProjectUrl from "../../utils/getProjectUrl";
import Link from "next/link";

export default function NodeShell(props: PublicNodePageProps) {
    const {pageNode, pageUser, pageProject, thisUser} = props;

    const nodeType = pageNode.type;
    const isPost = nodeType === "post";
    const isSource = nodeType === "source";

    return (
        <>
            <SEO title={pageNode.body.publishedTitle || `Untitled ${nodeType}`}/>
            <PublicNavbar pageUser={pageUser} pageProject={pageProject}/>
            <div className="px-4 flex justify-center">
                <div
                    className={`order-1 ${isPost ? "pb-32" : isSource ? "" : "p-8 border border-gray-300 rounded-md"}`}
                    style={{maxWidth: "78ch"}} // 78ch bc font size is 16 here but we want 65ch for font size 20
                >
                    <NodeInner {...props}/>
                </div>
                <div className="w-64 flex-shrink-0 order-0 mr-12">
                    {/*<UserButton user={pageUser}/>*/}
                    <Link href={getProjectUrl(pageUser, pageProject)}>
                        <a>
                            <h2 className="font-manrope font-bold mb-2">{pageProject.name}</h2>
                        </a>
                    </Link>
                    <p className="text-gray-400 text-sm my-2">{pageProject.description}</p>
                    <Tab.Group>
                        <Tab.List className="my-8">
                            {["Posts", "Evergreens", "Sources"].map(tab => (
                                <Tab key={tab} as={Fragment}>
                                    {({selected}) => (
                                        <button className={`uppercase font-semibold text-xs tracking-wider mr-4 ${selected ? "" : "text-gray-400"}`}>
                                            {tab}
                                        </button>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="opacity-25 hover:opacity-100 transition">
                            <Tab.Panel>
                                <NodeFeed
                                    pageUser={pageUser}
                                    pageProject={pageProject}
                                    thisUser={thisUser}
                                    type="post"
                                    isSidebar={true}
                                />
                            </Tab.Panel>
                            <Tab.Panel>
                                <NodeFeed
                                    pageUser={pageUser}
                                    pageProject={pageProject}
                                    thisUser={thisUser}
                                    type="evergreen"
                                    isSidebar={true}
                                />
                            </Tab.Panel>
                            <Tab.Panel>
                                <NodeFeed
                                    pageUser={pageUser}
                                    pageProject={pageProject}
                                    thisUser={thisUser}
                                    type="source"
                                    isSidebar={true}
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </>
    );
}