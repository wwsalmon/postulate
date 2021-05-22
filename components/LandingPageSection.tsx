import React, {ReactNode} from 'react';
import UpResponsiveH2 from "./UpResponsiveH2";

export default function LandingPageSection({heading, text, image}: { heading: ReactNode, text: ReactNode, image: ReactNode }) {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center">
                <div className="w-1/3">
                    <UpResponsiveH2>{heading}</UpResponsiveH2>
                    {text}
                </div>
                <div className="w-2/3 pl-12">
                    {image}
                </div>
            </div>
        </div>
    );
}