import {PublicNodePageProps} from "../../pages/[username]/[projectUrlName]/p/[urlName]";
import Badge from "../style/Badge";
import {SlateReadOnly} from "../../slate/SlateEditor";
import {format} from "date-fns";
import React, {HTMLProps, ReactNode, useEffect, useState} from "react";
import UiModal from "../style/UiModal";
import {useRouter} from "next/router";
import EvergreenInner from "./EvergreenInner";
import {Node} from "slate";
import UiH3 from "../style/UiH3";

const TruncatedText = ({value}: {value: Node[]}) => (
    <div className="max-h-32 text-gray-500 truncate relative">
        <SlateReadOnly
            value={value}
            fontSize={14}
            className="text-gray-400"
        />
        <div className="w-full absolute top-24 left-0 h-8 bg-gradient-to-t from-white"></div>
    </div>
);

const ThirdColumn = ({children}: {children: ReactNode}) => (
    <div className="md:w-1/3 md:px-4 my-4 md:my-0">
        {children}
    </div>
);

export default function NodeCard(props: PublicNodePageProps & {className?: string}) {
    const router = useRouter();
    const {id} = router.query;
    const {pageNode, pageProject, pageUser, thisUser} = props;

    const isPublished = !!pageNode.body.publishedTitle;
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const hasChanges = isOwner && isPublished && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);

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

    const title = (isOwner ? pageNode.body.title : pageNode.body.publishedTitle) || `Untitled ${pageNode.type}`;
    const body = isPublished ? pageNode.body.publishedBody : pageNode.body.body;
    const link = isPublished ? pageNode.body.publishedLink : pageNode.body.link;
    const takeaways = isPublished ? pageNode.body.publishedTakeaways : pageNode.body.takeaways;
    const summary = isPublished ? pageNode.body.publishedSummary : pageNode.body.summary;

    const dateString = `Last ${isPublished ? "published" : "updated"} ${format(new Date(isPublished ? pageNode.body.lastPublishedDate : pageNode.updatedAt), "MMM d, yyyy")}`;

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

    return (
        <>
            <button
                className={`p-4 border border-gray-300 rounded-md ${pageNode.type === "evergreen" ? "flex flex-col" : "w-full"} text-left ${props.className || ""}`}
                onClick={() => setIsModalOpen(true)}
            >
                {pageNode.type === "evergreen" ? (
                    <>
                        <div>
                            <h3 className="font-manrope font-semibold mb-1">{title}</h3>
                            <StatusBadge/>
                            <TruncatedText value={body}/>
                        </div>
                        <p className="text-gray-400 text-sm mt-auto pt-4">{dateString}</p>
                    </>
                ) : (
                    <div className="w-full flex flex-col md:flex-row -my-4 md:my-0 md:-mx-4">
                        <ThirdColumn>
                            <h3 className="font-manrope font-semibold mb-2">{title}</h3>
                            <StatusBadge className="mb-2"/>
                            <p className="text-gray-500 text-sm mb-2 truncate">{link}</p>
                            <p className="text-gray-400 text-sm">{dateString}</p>
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
                <div className="sm:px-4 py-4">
                    {pageNode.type === "evergreen" ? (
                        <EvergreenInner {...props} modal={true}/>
                    ) : (
                        <p>Source</p>
                    )}
                </div>
            </UiModal>
        </>
    );
}