import {ReactNode} from "react";
import {RoughNotation} from "react-rough-notation";

function SectionContainer({children}: {children: ReactNode}) {
    return (
        <div className="sm:flex items-center pt-24 border-t mt-24">
            {children}
        </div>
    );
}

function SectionHeader({children}: {children: ReactNode}) {
    return (
        <p className="max-w-sm text-xl sm:leading-[44px] sm:text-[32px] font-bold font-manrope">
            {children}
        </p>
    );
}

function Section({children, img, alt}: { children: ReactNode, img: string, alt: string }) {
    return (
        <SectionContainer>
            <div className="sm:w-1/2">
                <SectionHeader>
                    {children}
                </SectionHeader>
            </div>
            <div className="sm:w-1/2 mt-8 sm:mt-0">
                <img src={img} alt={alt} className="w-full"/>
            </div>
        </SectionContainer>
    );
}

export default function Sections() {
    return (
        <>

            <Section
                img="/landing/repos.png"
                alt="Screenshot of interface showing several repositories on a user account"
            >
                Create <RoughNotation type="highlight" show={true} color="yellow">repositories</RoughNotation> for projects, classes, or research topics
            </Section>
            <Section
                img="/landing/posts.png"
                alt="Screenshot of a post page"
            >
                Write <RoughNotation type="highlight" show={true} color="#00ff00">posts</RoughNotation> to serve as tutorials, notes, journals
            </Section>
            <Section
                img="/landing/sources.png"
                alt="Screenshot of interface showing a list of sources, with summary and takeaways for each one"
            >
                Save <RoughNotation type="highlight" show={true} color="#00ffff">sources</RoughNotation> for easy reference and use
            </Section>
            <SectionContainer>
                <div className="sm:w-1/2">
                    <SectionHeader>
                        Shareable and collaborative by default
                    </SectionHeader>
                    <p className="text-gray-500 mt-4 sm:text-xl">
                        Custom URLs, comments and more
                    </p>
                </div>
                <hr className="sm:hidden my-24"/>
                <div className="sm:w-1/2">
                    <SectionHeader>
                        First-class writing experience
                    </SectionHeader>
                    <p className="text-gray-500 mt-4 sm:text-xl">
                        Markdown paste, LaTeX support and more
                    </p>
                </div>
            </SectionContainer>
        </>
    );
}