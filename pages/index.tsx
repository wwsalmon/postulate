import axios from "axios";
import {useState} from "react";
import {WaitlistAPIRes} from "../utils/types";
import SEO from "../components/standard/SEO";
import Link from "next/link";
// import Head from "next/head"

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [submitted, setSubmitted] = useState<WaitlistAPIRes>(null);
    const [error, setError] = useState<any>(null);

    function onWaitlistSubmit() {
        axios.post("/api/waitlist", {
            email: email,
            url: window.location.href,
        }).then(res => {
            setSubmitted(res.data);
        }).catch(e => {
            console.log(e);
            setError(e);
        });
    }

    const badgeClasses = "rounded-full up-bg-gray-100 w-10 h-10 mr-4 flex items-center justify-center";

    return (
        <>
            <SEO/>
            {/*<Head>*/}
            {/*    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PN2PEJYJES"/>*/}
            {/*    <script dangerouslySetInnerHTML={{__html: `*/}
            {/*        window.dataLayer = window.dataLayer || [];*/}
            {/*        function gtag(){dataLayer.push(arguments);}*/}
            {/*        gtag('js', new Date());*/}
            {/*        */}
            {/*        gtag('config', 'G-PN2PEJYJES');*/}
            {/*    `}}/>*/}
            {/*</Head>*/}
            {/*<div className="w-full fixed top-0 z-50">*/}
            {/*    <div className="px-4 mx-auto flex h-16 items-center w-full">*/}
            {/*        <img src="/logo.svg" alt="Postulate logo" className="h-10 hidden sm:block"/>*/}
            {/*        <img src="/postulate-tile.svg" alt="Postulate logo" className="h-10 sm:hidden"/>*/}
            {/*        <UpInlineButton href="/auth/signin" className="ml-auto hidden sm:inline-block">Sign in</UpInlineButton>*/}
            {/*        <a href="#waitlist" className="up-button primary small ml-auto sm:ml-4">Sign up for waitlist</a>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="w-full fixed top-0 z-50 flex items-center">
                <Link href="/auth/signin">
                    <a className="text-white ml-auto mt-4 mr-8 opacity-75 hover:opacity-100 transition">
                        Sign in
                    </a>
                </Link>
            </div>
            <div className="w-full border-b up-border-gray-200" style={{
                background: "linear-gradient(60deg, rgba(2,1,31,1) 5%, rgba(5,25,138,1) 26%, rgba(0,212,255,1) 95%)",
            }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-20">
                    <style jsx>{`
                    .hero-overall {
                        line-height: 39px;
                    }
                    
                    .hero-sans-style {
                        font-size: 32px;
                        font-weight: 300;
                    }
                    
                    .hero-serif-style {
                        font-size: 36px;
                        font-family: "Alegreya", serif;
                        font-style: italic;
                    }
                    
                    @media (min-width: 870px) {
                        .hero-overall {
                            line-height: 52px;
                        }

                        .hero-sans-style {
                            font-size: 43px;
                        }

                        .hero-serif-style {
                            font-size: 48px;
                        }
                    }
                `}</style>
                    <img src="/postulate-tile.svg" className="w-12 h-12 mb-16" alt="Postulate logo"/>
                    <h1 className="hero-overall text-white">
                        <span className="hero-sans-style">Postulate is </span>
                        <span className="hero-serif-style">GitHub for knowledge: </span>
                        <br className="hidden sm:block"/>
                        <span className="hero-sans-style">a notetaking app for </span>
                        <span className="hero-serif-style">sharing your thoughts, <br className="hidden sm:block"/>learning, and work </span>
                        <span className="hero-sans-style">with the world.</span>
                    </h1>
                    <p className="my-10 text-white opacity-75 content leading-relaxed">
                        Effortlessly capture notes and research. Turn them into written content, or <br className="hidden lg:block"/>publish them directly. 10x your learning and writing output with Postulate.
                    </p>
                    <div className="mt-12 flex">
                        {submitted ? (
                            <p className="text-white opacity-75">
                                You are in <strong>position {submitted && submitted.data.current_priority}</strong>.
                                Get your friends to sign up with this link to move up in the list: <code>{submitted && submitted.data.referral_link}</code>
                            </p>
                        ) : (
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto">
                                <input
                                    type="text"
                                    className="p-2 rounded-md text-black w-full sm:w-auto"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button className="up-button small primary ml-auto mt-2 sm:ml-4 sm:mt-0" onClick={onWaitlistSubmit}>Sign up for waitlist</button>
                            </div>
                        )}
                    </div>
                    <Link href="/@laura">
                        <a>
                            <img src="/landing/hero-laura.png" alt="Laura Gao's Postulate profile" className="w-full border up-border-gray-200 rounded-lg relative -mt-12 top-32"/>
                        </a>
                    </Link>
                </div>
            </div>
            <div className="w-full mt-32" id="waitlist">
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
                    <div className="mb-20">
                        <Link href="/explore">
                            <a className="underline">Explore the platform</a>
                        </Link>
                    </div>
                    <div className="sm:flex items-center">
                        <h2 className="flex-shrink-0 mr-8 mb-4 sm:mb-0"><b>10x your learning and writing output</b><br/>Sign up for the waitlist</h2>
                        {submitted ? (
                            <div className="ml-auto">
                                <p>
                                    You are in <strong>position {submitted && submitted.data.current_priority}</strong>.
                                    Get your friends to sign up with this link to move up in the list: <code>{submitted && submitted.data.referral_link}</code>
                                </p>
                            </div>
                        ) : (
                            <div className="ml-auto flex">
                                <input
                                    type="text"
                                    className="p-2 rounded-md text-black"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button className="up-button small primary ml-4" onClick={onWaitlistSubmit}>Sign up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className="w-full text-white bg-black"
                // style={{background: "linear-gradient(30deg, rgba(2,1,31,1) 0%, rgba(5,25,138,1) 26%, rgba(0,212,255,1) 95%)"}}
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
                    <p>
                        Follow <a href="https://twitter.com/postulateapp" className="underline">Postulate on Twitter</a>.
                        Built with ♥ by <a href="https://twitter.com/wwsalmon" className="underline">Samson Zhang</a>
                    </p>
                </div>
            </div>
        </>
    )
}