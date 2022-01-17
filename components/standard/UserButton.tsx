import InlineButton from "../style/InlineButton";
import React from "react";
import {DatedObj, UserObj} from "../../utils/types";

export default function UserButton({user, className}: {user: DatedObj<UserObj>, className?: string}) {
    return (
        <InlineButton flex={true} className={className} href={`/@${user.username}`}>
            <img
                src={user.image}
                alt={`Profile picture of ${user.name}`}
                className="w-6 h-6 rounded-full mr-2"
            />
            <span>{user.name}</span>
        </InlineButton>
    );
}