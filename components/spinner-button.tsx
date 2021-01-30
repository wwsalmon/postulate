import React, {ReactNode} from 'react';

export default function SpinnerButton({onClick, isLoading, isDisabled = false, className = "", children}: {
    onClick: () => any,
    isLoading: boolean,
    isDisabled?: boolean,
    className?: string,
    children: ReactNode,
}) {
    return (
        <div className="relative inline-block">
            <button
                className={"up-button primary mr-2 " + className}
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