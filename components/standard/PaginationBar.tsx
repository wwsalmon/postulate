import React, {Dispatch, SetStateAction} from "react";
import UiH3 from "../style/UiH3";

export default function PaginationBar({page, count, label, setPage, className, countPerPage: propCountPerPage}: {
    page: number,
    count: number,
    label: string,
    setPage: Dispatch<SetStateAction<number>>,
    className?: string,
    countPerPage?: number,
}) {
    const countPerPage = propCountPerPage || 10;

    return (
        <div className={className || ""}>
            <p className="text-sm text-gray-400">
                Showing {label} {count === 0 ? count : page * countPerPage + 1}
                -{((page + 1) < Math.ceil(count / countPerPage)) ? (page + 1) * countPerPage : count} of {count}
            </p>
            {count > countPerPage && (
                <div className="mt-4">
                    {Array.from({length: Math.ceil(count / countPerPage)}, (x, i) => i).map(d => (
                        <button
                            className={"py-2 px-4 rounded-md mr-2 text-sm font-manrope " + (d === page ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                            onClick={() => setPage(d)}
                            disabled={+d === +page}
                        >{d + 1}</button>
                    ))}
                </div>
            )}
        </div>
    );
}