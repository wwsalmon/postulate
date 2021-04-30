import React, {Dispatch, SetStateAction} from "react";

export default function PaginationBar({page, count, label, setPage}: {
    page: number,
    count: number,
    label: string,
    setPage: Dispatch<SetStateAction<number>>,
}) {
    return (
        <>
            <p className="up-gray-400 mt-16">
                Showing {label} {(page - 1) * 10 + 1}
                -{(page < Math.floor(count / 10)) ? page * 10 : count} of {count}
            </p>
            {count > 10 && (
                <div className="mt-4">
                    {Array.from({length: Math.ceil(count / 10)}, (x, i) => i + 1).map(d => (
                        <button
                            className={"py-2 px-4 rounded-md mr-2 " + (d === page ? "opacity-50 cursor-not-allowed bg-gray-100" : "")}
                            onClick={() => setPage(d)}
                            disabled={+d === +page}
                        >{d}</button>
                    ))}
                </div>
            )}
        </>
    );
}