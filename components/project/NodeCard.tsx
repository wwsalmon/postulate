import Badge from "../style/Badge";
import {format} from "date-fns";
import React, {HTMLProps, ReactNode, useEffect, useState} from "react";
import UiModal from "../style/UiModal";
import {useRouter} from "next/router";
import UiH3 from "../style/UiH3";
import NodeInner from "./NodeInner";
import TruncatedText from "../standard/TruncatedText";
import {PublicNodePageProps} from "../../utils/getPublicNodeSSRFunction";
import {FiExternalLink} from "react-icons/fi";
import {getPlainTextFromSlateValue} from "../../slate/SlateEditor";

const ThirdColumn = ({children}: {children: ReactNode}) => (
    <div className="md:w-1/3 md:px-4 my-4 md:my-0">
        {children}
    </div>
);

export const ExternalBadge = ({className}: {className?: string}) => (
    <div className={`flex items-center text-gray-400 text-xs font-manrope font-semibold ${className || ""}`}>
        <FiExternalLink/>
        <span className="ml-2">From another project</span>
    </div>
);

export default function NodeCard({isSidebar, ...props}: PublicNodePageProps & {className?: string, isSidebar?: boolean}) {
    const router = useRouter();
    const {id} = router.query;
    const {pageNode, pageUser, thisUser} = props;

    const isPublished = "publishedTitle" in pageNode.body;
    const isExternal = !!pageNode.shortcut;
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const hasChanges = isOwner && "publishedBody" in pageNode.body && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const setIsModalOpen = (value: boolean) => {
        router.push({
            pathname: router.asPath.split("?")[0],
            query : value ? {id: pageNode._id} : {},
        }, null, {shallow: true}).then(() => setIsOpen(value));
    }

    useEffect(() => {
        if (id === pageNode._id) setIsOpen(true);
        else setIsOpen(false);
    }, [id]);

    const title = (("urlName" in pageNode.body && !isOwner) ? pageNode.body.publishedTitle : pageNode.body.title) || `Untitled ${pageNode.type}`;
    const body = pageNode.type !== "source" && ("urlName" in pageNode.body ? pageNode.body.publishedBody : pageNode.body.body);
    const sourceInfo = pageNode.type === "source" && ("urlName" in pageNode.body ? pageNode.body.publishedSourceInfo : pageNode.body.sourceInfo);
    const takeaways = pageNode.type === "source" && ("urlName" in pageNode.body ? pageNode.body.publishedTakeaways : pageNode.body.takeaways);
    const summary = pageNode.type === "source" && ("urlName" in pageNode.body ? pageNode.body.publishedSummary : pageNode.body.summary);

    const dateString = `${format(new Date("urlName" in pageNode.body ? pageNode.body.publishedDate : pageNode.createdAt), "MMM d, yyyy")}`;

    const StatusBadge = (props: HTMLProps<HTMLDivElement>) => (
        <div {...props}>
            {!isPublished && (
                <Badge dark={true}>
                    <span>Unpublished draft</span>
                </Badge>
            )}
            {hasChanges && (
                <Badge>
                    <span>Unpublished changes</span>
                </Badge>
            )}
        </div>
    );

    const StatusParagraph = (props: HTMLProps<HTMLParagraphElement>) => (
        <p {...props}>
            {!isPublished && "Unpublished draft"}
            {hasChanges && "Unpublished changes"}
        </p>
    );

    return (
        <>
            <button
                className={`${isSidebar ? "p-3 w-full" : "p-4"} border border-gray-300 rounded-md ${pageNode.type === "evergreen" ? "flex flex-col" : "w-full"} text-left ${props.className || ""}`}
                onClick={() => setIsModalOpen(true)}
            >
                {(pageNode.type === "evergreen" || isSidebar) ? (
                    <>
                        <div className="w-full">
                            <h3 className={`font-manrope font-semibold ${isSidebar ? "text-sm" : "mb-1"}`}>{title}</h3>
                            {!isSidebar && (
                                <StatusBadge/>
                            )}
                            {pageNode.type === "evergreen" ? (
                                <TruncatedText value={body} isSmall={true}/>
                            ) : (
                                <p className="text-xs mt-2 text-gray-500 line-clamp-1">
                                    {getPlainTextFromSlateValue(sourceInfo)}
                                </p>
                            )}
                        </div>
                        <div className={`flex items-center text-gray-400 text-xs font-manrope font-semibold mt-auto ${isSidebar ? "pt-2" : "pt-4"}`}>
                            <p className={isSidebar ? "mr-3" : "mr-4"}>{dateString}</p>
                            {isSidebar && (
                                <StatusParagraph/>
                            )}
                            {isExternal && (
                                <ExternalBadge/>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full flex flex-col md:flex-row -my-4 md:my-0 md:-mx-4">
                        <ThirdColumn>
                            <h3 className="font-manrope font-semibold mb-2">{title}</h3>
                            <StatusBadge className="mb-2"/>
                            <p className="text-xs mb-2 text-gray-500 line-clamp-1">
                                {getPlainTextFromSlateValue(sourceInfo)}
                            </p>
                            <p className="text-gray-400 text-sm">{dateString}</p>
                            {isExternal && (
                                <ExternalBadge className="mt-2"/>
                            )}
                        </ThirdColumn>
                        <ThirdColumn>
                            <UiH3 className="text-sm mb-2">Summary</UiH3>
                            <TruncatedText value={summary}/>
                        </ThirdColumn>
                        <ThirdColumn>
                            <UiH3 className="text-sm">Takeaways</UiH3>
                            <TruncatedText value={takeaways}/>
                        </ThirdColumn>
                    </div>
                )}
            </button>
            <UiModal isOpen={isOpen} setIsOpen={setIsModalOpen} wide={true}>
                <div className="sm:px-4 px-0 py-4">
                    <NodeInner {...props} isModal={true}/>
                </div>
            </UiModal>
        </>
    );
}