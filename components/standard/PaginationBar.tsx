import React, {Dispatch, SetStateAction} from "react";
import UiH3 from "../style/UiH3";

export default function PaginationBar({page, count, label, setPage, className}: {
    page: number,
    count: number,
    label: string,
    setPage: Dispatch<SetStateAction<number>>,
    className?: string,
}) {
    return (
        <div className={className || ""}>
            <p className="text-sm text-gray-400">
                Showing {label} {page * 10 + 1}
                -{((page + 1) < Math.floor(count / 10)) ? (page + 1) * 10 : count} of {count}
            </p>
            {count > 10 && (
                <div className="mt-4">
                    {Array.from({length: Math.ceil(count / 10)}, (x, i) => i).map(d => (
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