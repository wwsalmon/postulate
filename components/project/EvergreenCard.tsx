import {PublicNodePageProps} from "../../pages/[username]/[projectUrlName]/p/[urlName]";
import Badge from "../style/Badge";
import {SlateReadOnly} from "../../slate/SlateEditor";
import {format} from "date-fns";
import React, {useEffect, useState} from "react";
import UiModal from "../style/UiModal";
import {useRouter} from "next/router";
import getProjectUrl from "../../utils/getProjectUrl";
import EvergreenInner from "./EvergreenInner";

export default function EvergreenCard(props: PublicNodePageProps) {
    const router = useRouter();
    const {id} = router.query;
    const {pageNode, pageProject, pageUser, thisUser} = props;

    const isPublished = !!pageNode.body.publishedTitle;
    const isOwner = thisUser && pageUser._id === thisUser._id;
    const hasChanges = isOwner && isPublished && JSON.stringify(pageNode.body.publishedBody) !== JSON.stringify(pageNode.body.body);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const setIsModalOpen = (value: boolean) => {
        router.push({
            pathname: `${getProjectUrl(pageUser, pageProject)}/evergreens`,
            query : value ? {id: pageNode._id} : {},
        }, null, {shallow: true}).then(() => setIsOpen(value));
    }

    useEffect(() => {
        if (id === pageNode._id) setIsOpen(true);
        else setIsOpen(false);
    }, [id]);

    return (
        <>
            <button className="p-4 border border-gray-300 rounded-md flex flex-col text-left" onClick={() => setIsModalOpen(true)}>
                <div>
                    <h3
                        className="font-manrope font-semibold mb-1"
                        key={pageNode._id}
                    >{(isOwner ? pageNode.body.title : pageNode.body.publishedTitle) || "Untitled post"}</h3>
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
                    <div className="max-h-32 text-gray-500 truncate relative">
                        <SlateReadOnly
                            value={isPublished ? pageNode.body.publishedBody : pageNode.body.body}
                            fontSize={14}
                            className="text-gray-400"
                        />
                        <div className="w-full absolute top-24 left-0 h-8 bg-gradient-to-t from-white"></div>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-auto pt-4">
                    Last {isPublished ? "published" : "updated"} {format(new Date(isPublished ? pageNode.body.lastPublishedDate : pageNode.updatedAt), "MMM d, yyyy")}
                </p>
            </button>
            <UiModal isOpen={isOpen} setIsOpen={setIsModalOpen} wide={true}>
                <div className="sm:px-4 py-4">
                    <EvergreenInner {...props} small={true}/>
                </div>
            </UiModal>
        </>
    );
}