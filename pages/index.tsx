import {useState} from "react";
import {FiBookOpen, FiEdit, FiGlobe} from "react-icons/fi";
import HomeStep from "../components/home-step";
import axios from "axios";
import {WaitlistAPIRes} from "../utils/types";
import UpSEO from "../components/up-seo";
import Head from "next/head";
import UpInlineButton from "../components/style/UpInlineButton";
import UpResponsiveH2 from "../components/UpResponsiveH2";
import LandingPageSection from "../components/LandingPageSection";

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

    const containerClasses = "px-4 mx-auto max-w-5xl py-8";

    return (
        <>
            <UpSEO/>
            <Head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-PN2PEJYJES"/>
                <script dangerouslySetInnerHTML={{__html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    gtag('config', 'G-PN2PEJYJES');
                `}}/>
            </Head>
            <div className="w-full bg-white sticky top-0 z-50">
                <div className="px-4 mx-auto max-w-5xl flex h-16 items-center">
                    <img src="/logo.svg" alt="Postulate logo" className="h-10"/>
                    <UpInlineButton href="/auth/signin" className="ml-auto mr-4">Sign in</UpInlineButton>
                    <a href="#waitlist" className="up-button primary small">Sign up for waitlist</a>
                </div>
            </div>
            <div className="w-full">
                <div className="my-16 text-white text-center up-primary relative z-10 max-w-7xl px-4 mx-auto">
                    <p className="sm:text-xl lg:text-2xl font-medium mb-3 opacity-75">Postulate helps you turn your notes into content, so you can</p>
                    <h1 className="up-font-display text-3xl sm:text-4xl lg:text-5xl">
                        <b>Publish your ideas </b>instead of forgetting them
                    </h1>
                </div>
                <div className="relative">
                    <div className="w-full up-primary absolute left-0" style={{transform: "skew(0deg, -5deg)", height: "100vh", top: "calc(-100vh + 30%)"}}/>
                    <img src="/hero-graphic.svg" alt="Hero image" className="max-w-7xl px-4 w-full mx-auto block relative mb-24"/>
                </div>
            </div>
            <div className="max-w-3xl px-4 mx-auto my-16">
                <UpResponsiveH2 className="text-center mb-12">
                    Other notetaking apps kill ideas.<br/><b>Postulate gives them superpowers.</b>
                </UpResponsiveH2>
                <p className="my-6 leading-relaxed">
                    “Idea graveyard”. “Black hole.” “Knowledge anxiety.” Notetaking apps are great for taking short-term, private notes, but they create huge choke points for getting your ideas out into the world.
                </p>
                <p className="my-6 leading-relaxed">
                    Postulate is the first notetaking and writing tool designed for writers
                </p>
            </div>
            <div className="max-w-7xl mx-auto px-4">
                <script type="text/javascript" src="https://testimonial.to/js/iframeResizer.min.js"/>
                <iframe
                    id="testimonialto-postulate-homepage-light"
                    src="https://embed.testimonial.to/w/postulate-homepage?theme=light&card=small"
                    frameBorder="0"
                    scrolling="no"
                    width="100%"
                />
                <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
                    iFrameResize({log: false, checkOrigin: false}, "#testimonialto-postulate-homepage-light");
                `}}/>
            </div>
            <hr className="my-16 max-w-4xl px-4 mx-auto"/>
            <LandingPageSection heading={(
                <>
                    All your notes<br/>
                    <b>in one place</b>
                </>
            )} text={(
                <p className="my-8">
                    Never lose a valuable thought again. Jot down ideas, or save links with our Chrome extension. Postulate is the fastest way to collect your thoughts and store them, all in one place.
                </p>
            )} image={(
                <img src="/landing/feature-notes.png" alt="Notetaking feature" className="w-full"/>
            )}/>
            <hr className="my-16 max-w-4xl px-4 mx-auto"/>
            <LandingPageSection heading={(
                <>
                    Turn your notes<br/>
                    <b>into writing</b>
                </>
            )} text={(
                <p className="my-8">
                    Postulate snippets are meant to be turned into posts: pull them up right next to a post editor for easy reference, and use snippet-to-post conversion metrics to gamify the writing process.
                </p>
            )} image={(
                <img src="/landing/feature-notes.png" alt="Notetaking feature" className="w-full"/>
            )}/>
            <hr className="my-16 max-w-4xl px-4 mx-auto"/>
            <LandingPageSection heading={(
                <>
                    The easiest way<br/>
                    to set up your<br/>
                    <b>blog or newsletter</b>
                </>
            )} text={(
                <p className="my-8">
                    Publishing on Postulate is the easiest way to give your content a beautiful and powerful online home.
                </p>
            )} image={(
                <img src="/landing/feature-notes.png" alt="Notetaking feature" className="w-full"/>
            )}/>
            <hr className="my-16 max-w-4xl px-4 mx-auto"/>
            <div className="w-full up-primary" id="waitlist">
                <div className={containerClasses}>
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
                                <button className="up-button primary ml-4" onClick={onWaitlistSubmit}>Sign up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={containerClasses}>
                <p>
                    Follow <a href="https://twitter.com/postulateapp" className="underline">Postulate on Twitter</a>.
                    Built with ♥ by <a href="https://twitter.com/wwsalmon" className="underline">Samson Zhang</a>
                </p>
            </div>
        </>
    )
}