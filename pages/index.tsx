import SEO from "../components/standard/SEO";
import SignInButton from "../components/standard/SignInButton";
import Sections from "../components/lander/v3";
import Footer from "../components/lander/Footer";

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
                <Sections/>
                <hr className="my-24"/>
                <SignInButton className="my-24 mx-auto block">Learn in public with Postulate</SignInButton>
            </div>
            <Footer/>
        </>
    );
}