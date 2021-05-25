import React from 'react';
import SubscriptionButton from "./SubscriptionButton";

export default function SubscriptionInsert({projectId, projectName, ownerName, isOwner}: { projectId: string, projectName: string, ownerName: string, isOwner: boolean }) {
    return (
        <div className="text-sm">
            <p className="font-bold" style={{padding: 0}}>Subscribe to this project</p>
            {isOwner ? (
                <p className="up-gray-400" style={{padding: 0}}>Viewers of your post will see a call-to-action to subscribe with their email here.</p>
            ) : (
                <>
                    <p className="up-gray-400" style={{padding: 0, marginBottom: "1rem"}}>Subscribe to get an email whenever a new post is published in {projectName} by {ownerName}</p>
                    <SubscriptionButton projectId={projectId}/>
                </>
            )}
        </div>
    );
}