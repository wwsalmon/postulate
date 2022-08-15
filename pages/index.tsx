import SEO from "../components/standard/SEO";
import SignInButton from "../components/standard/SignInButton";
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

export default function Index({}: {}) {
    return (
        <>
            <SEO/>
            <div className="text-center px-4">
                <h1 className="font-bold font-manrope text-4xl sm:text-5xl leading-tight sm:leading-tight mt-16 mb-6 max-w-xl mx-auto">
                    The best way to record and share your learning
                </h1>
                <p className="text-xl sm:text-2xl leading-normal sm:leading-normal text-gray-500 max-w-lg mx-auto">
                    Remember insights from work, research, and classes by saving it in Postulate.
                </p>
                <SignInButton className="mt-6">Learn in public with Postulate</SignInButton>
            </div>
            <img src="/hero.png" alt="Hero banner" className="w-full my-24 hidden sm:block"/>
            <img src="/hero-mobile.png" alt="Hero banner" className="w-full my-24 sm:hidden"/>
            <div className="max-w-6xl mx-auto px-4">
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
                <hr className="my-24"/>
                <SignInButton className="my-24 mx-auto block">Learn in public with Postulate</SignInButton>
            </div>
            <div className="w-full text-white bg-black px-4 py-4 mb-12 sm:mb-0">
                <p>
                    Follow <a href="https://twitter.com/postulateapp" className="underline">Postulate on Twitter</a>.
                    Built with ♥ by <a href="https://twitter.com/wwsalmon" className="underline">Samson Zhang</a>
                </p>
            </div>
        </>
    );
}