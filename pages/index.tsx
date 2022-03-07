import SEO from "../components/standard/SEO";
import SignInButton from "../components/standard/SignInButton";

export default function Index({}: {}) {
    return (
        <>
            <SEO/>
            <div className="text-center px-4">
                <h1 className="font-bold font-manrope text-4xl sm:text-5xl leading-tight sm:leading-tight mt-16 mb-6 max-w-xl mx-auto">
                    The best way to take and share reading notes
                </h1>
                <p className="text-xl sm:text-2xl leading-normal sm:leading-normal text-gray-500 max-w-lg mx-auto">
                    Stop forgetting what you learn in classes, research, and personal projects.
                </p>
                <SignInButton className="mt-6">Learn in public with Postulate</SignInButton>
            </div>
            <img src="/hero.png" alt="Hero banner" className="w-full my-24 hidden sm:block"/>
            <img src="/hero-mobile.png" alt="Hero banner" className="w-full my-24 sm:hidden"/>
            <div className="w-full text-white bg-black px-4 py-4 mb-12 sm:mb-0">
                <p>
                    Follow <a href="https://twitter.com/postulateapp" className="underline">Postulate on Twitter</a>.
                    Built with ♥ by <a href="https://twitter.com/wwsalmon" className="underline">Samson Zhang</a>
                </p>
            </div>
        </>
    );
}