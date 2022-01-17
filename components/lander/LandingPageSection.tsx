import React, {ReactNode} from 'react';

export default function LandingPageSection({heading, text, image, comingSoon, className}: { heading: ReactNode, text: ReactNode, image: ReactNode, comingSoon?: boolean, className?: string }) {
    return (
        <div className={className || ""}>
            <hr className="my-16 max-w-5xl px-4 mx-auto"/>
            <div className="max-w-5xl mx-auto px-4">
                <div className="sm:flex items-center">
                    <div className="sm:w-1/3">
                        {comingSoon && (
                            <div className="px-3 py-1 rounded-xl up-bg-gray-100 inline-block mb-4">
                                <span className="uppercase text-xs font-bold up-gray-400">Coming soon</span>
                            </div>
                        )}
                        <h2 className={"up-font-display text-2xl sm:text-3xl lg:text-4xl"}>{heading}</h2>
                        {text}
                    </div>
                    <div className="sm:w-2/3 sm:pl-16 md:pl-24">
                        {image}
                    </div>
                </div>
            </div>
        </div>
    );
}