import InlineButton from "../style/InlineButton";
import React from "react";
import {DatedObj, UserObj} from "../../utils/types";

export default function UserButton({user, className, imageSizeClasses, hideName}: {user: DatedObj<UserObj>, className?: string, imageSizeClasses?: string, hideName?: boolean}) {
    return (
        <InlineButton flex={true} className={className} href={`/@${user.username}`}>
            <img
                src={user.image}
                alt={`Profile picture of ${user.name}`}
                className={`${imageSizeClasses || "w-6 h-6"} rounded-full`}
            />
            {!hideName && (
                <span className="mr-2">{user.name}</span>
            )}
        </InlineButton>
    );
}