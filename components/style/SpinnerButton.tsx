import React, {ReactNode} from 'react';

export default function SpinnerButton({onClick, isLoading, isDisabled = false, className = "", children, noRightMargin}: {
    onClick: () => any,
    isLoading: boolean,
    isDisabled?: boolean,
    className?: string,
    noRightMargin?: boolean,
    children: ReactNode,
}) {
    return (
        <div className="relative inline-block">
            <button
                className={"up-button primary " + className + (noRightMargin ? "" : " mr-2")}
                onClick={onClick}
                disabled={isLoading || isDisabled}
            >
                <div className={isLoading ? "invisible" : ""}>
                    {children}
                </div>
            </button>
            {isLoading && (
                <div className="up-spinner"/>
            )}
        </div>
    );
}