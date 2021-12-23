import React, {Dispatch, SetStateAction} from 'react';
import UpBanner from "../style/UpBanner";

export default function PaginationBanner({page, label, setPage, className}: { page: number, label: string, setPage: Dispatch<SetStateAction<number>>, className?: string }) {
    return page > 1 ? (
        <UpBanner className={"flex items-center " + (className || "")}>
            <span>Showing <b>page {page}</b> of {label}</span>
            <button className="up-button text small ml-auto" onClick={() => setPage(1)}>Back to recent</button>
        </UpBanner>
    ) : <></>;
}