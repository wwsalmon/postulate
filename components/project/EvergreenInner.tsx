import H1 from "../style/H1";
import {format} from "date-fns";
import {MoreMenu, MoreMenuButton, MoreMenuItem} from "../headless/MoreMenu";
import getProjectUrl from "../../utils/getProjectUrl";
import {SlateReadOnly} from "../../slate/SlateEditor";
import PublicNavbar from "./PublicNavbar";
import {PublicNodePageProps} from "../../pages/[username]/[projectUrlName]/p/[urlName]";

export default function EvergreenInner({pageUser, pageNode, pageProject, thisUser}: PublicNodePageProps) {
    const {body: {title: privateTitle, body: privateBody, publishedTitle, publishedBody, publishedDate, lastPublishedDate}, createdAt, updatedAt} = pageNode;
    const isOwner = thisUser && pageNode.userId === thisUser._id;
    const isPublished = !!publishedTitle;
    const title = isPublished ? publishedTitle : privateTitle;
    const body = isPublished ? publishedBody : privateBody;

    return (title && body) ? (
        <>
            <H1 small={true}>{title}</H1>
            <div className="flex items-center my-8 font-manrope text-gray-400 font-semibold">
                <span className="mr-4">{format(new Date(publishedDate || createdAt), "MMM d, yyyy")}</span>
                {isPublished && publishedDate !== lastPublishedDate && (<span className="mr-4">Last updated {format(new Date(lastPublishedDate), "MMM d, yyyy")}</span>)}
                {!isPublished && createdAt !== updatedAt && (<span className="mr-4">Last updated {format(new Date(updatedAt), "MMM d, yyyy")}</span>)}
                {isOwner && (
                    <MoreMenu button={<MoreMenuButton/>} className="ml-auto">
                        <MoreMenuItem href={`${getProjectUrl(pageUser, pageProject)}/${pageNode._id}`}>Edit</MoreMenuItem>
                    </MoreMenu>
                )}
            </div>
            <SlateReadOnly value={body}/>
        </>
    ) : (
        <p>Invalid node</p>
    );
}