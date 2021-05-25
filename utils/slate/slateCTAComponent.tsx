import React from "react";

export const slateCTAComponent = ({attributes, children, nodeProps}) => (
    <div {...attributes} className="p-4 my-8 rounded-md border select-none text-sm">
        <div contentEditable={false} {...nodeProps}>
            <p className="font-bold" style={{margin: 0, padding: 0}}>Subscribe to this project</p>
            <p className="up-gray-400" style={{margin: 0, padding: 0}}>
                Viewers of your post will see a call-to-action to subscribe with their email here.
                {children}
            </p>
        </div>
    </div>
);