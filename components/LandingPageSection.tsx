import React, {ReactNode} from 'react';
import UpResponsiveH2 from "./UpResponsiveH2";

export default function LandingPageSection({heading, text, image, comingSoon}: { heading: ReactNode, text: ReactNode, image: ReactNode, comingSoon?: boolean }) {
    return (
        <>
            <hr className="my-16 max-w-5xl px-4 mx-auto"/>
            <div className="max-w-5xl mx-auto px-4">
                <div className="sm:flex items-center">
                    <div className="sm:w-1/3">
                        {comingSoon && (
                            <div className="px-3 py-1 rounded-xl up-bg-gray-100 inline-block mb-4">
                                <span className="uppercase text-xs font-bold up-gray-400">Coming soon</span>
                            </div>
                        )}
                        <UpResponsiveH2>{heading}</UpResponsiveH2>
                        {text}
                    </div>
                    <div className="sm:w-2/3 sm:pl-16 md:pl-24">
                        {image}
                    </div>
                </div>
            </div>
        </>
    );
}