import Button from "../headless/Button";
import getProjectUrl from "../../utils/getProjectUrl";
import InlineButton from "../style/InlineButton";
import {DatedObj, ProjectObj, UserObj} from "../../utils/types";

export default function PublicNavbar({pageUser, pageProject}: {pageUser: DatedObj<UserObj>, pageProject: DatedObj<ProjectObj>}) {
    return (
        <div
            className="fixed top-0 left-1/2 -translate-x-1/2 flex items-center z-40 transform h-12 sm:h-16"
            style={{maxWidth: "calc(100% - 220px)"}}
        >
            <Button
                href={getProjectUrl(pageUser, pageProject)}
                className="font-manrope font-bold text-lg w-full"
                childClassName="truncate"
            >
                {pageProject.name}
            </Button>
            <span className="mx-4 text-gray-300 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center">
                <InlineButton href={`/@${pageUser.username}`} flex={true}>
                    <img src={pageUser.image} alt={`Profile picture of ${pageUser.name}`} className="rounded-full w-6 h-6"/>
                    <span className="ml-2">{pageUser.name}</span>
                </InlineButton>
            </div>
        </div>
    );
}