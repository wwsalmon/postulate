import {useState} from "react";
import {FiBookOpen, FiEdit, FiGlobe, FiMail, FiMessageSquare, FiSearch} from "react-icons/fi";
import HomeStep from "../components/home-step";
import axios from "axios";
import {WaitlistAPIRes} from "../utils/types";
import UpSEO from "../components/up-seo";
import Head from "next/head";
import UpInlineButton from "../components/style/UpInlineButton";
import UpResponsiveH2 from "../components/UpResponsiveH2";
import LandingPageSection from "../components/LandingPageSection";
import {BiPaint} from "react-icons/bi";

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
    const badgeClasses = "rounded-full up-bg-gray-100 w-10 h-10 mr-4 flex items-center justify-center";

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
                <div className="px-4 mx-auto max-w-5xl flex h-16 items-center w-full">
                    <img src="/logo.svg" alt="Postulate logo" className="h-10 hidden sm:block"/>
                    <img src="/postulate-tile.svg" alt="Postulate logo" className="h-10 sm:hidden"/>
                    <UpInlineButton href="/auth/signin" className="ml-auto hidden sm:inline-block">Sign in</UpInlineButton>
                    <a href="#waitlist" className="up-button primary small ml-auto sm:ml-4">Sign up for waitlist</a>
                </div>
            </div>
            <div className="w-full" id="waitlist">
                <div className="my-16 text-white text-center up-primary relative z-10 max-w-7xl px-4 mx-auto">
                    <p className="sm:text-xl lg:text-2xl font-medium mb-3 opacity-75">Postulate helps you turn your notes into content, so you can</p>
                    <h1 className="up-font-display text-3xl sm:text-4xl lg:text-5xl">
                        <b>Publish your ideas </b>instead of forgetting them
                    </h1>
                    <div className="mt-12 flex">
                        {submitted ? (
                                <p>
                                    You are in <strong>position {submitted && submitted.data.current_priority}</strong>.
                                    Get your friends to sign up with this link to move up in the list: <code>{submitted && submitted.data.referral_link}</code>
                                </p>
                        ) : (
                            <div className="mx-auto flex">
                                <input
                                    type="text"
                                    className="p-2 rounded-md text-black"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button className="up-button primary ml-4" onClick={onWaitlistSubmit}>Sign up for waitlist</button>
                            </div>
                        )}
                    </div>
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
                    “Idea graveyard”. “Black hole.” “Take notes, then never see them again.” Apps like Notion and Roam are great for taking private notes, but they create huge choke points when you're trying to get your ideas out into the world.
                </p>
                <p className="my-6 leading-relaxed">
                    Postulate is the first notetaking and writing tool designed for writers, not passive notetakers. After you capture your thoughts, Postulate pushes you to turn them into publishable blog posts, reducing friction and introducing gamification to make the writing process fun, easy, and consistent.
                </p>
            </div>
            <div className="max-w-5xl mx-auto px-4">
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
            <LandingPageSection heading={(
                <>
                    Effortlessly capture your thoughts
                </>
            )} text={(
                <p className="my-8">
                    Never lose a valuable thought again: jot down ideas, reading summaries, conversation notes, or whatever else is on your mind and store them all in one place.
                </p>
            )} image={(
                <img src="/landing/feature-notes.jpg" alt="Notetaking feature" className="w-full shadow-lg"/>
            )}/>
            <LandingPageSection heading={(
                <>
                    Turn your notes into writing
                </>
            )} text={(
                <p className="my-8">
                    Snippets aren't meant to stay private: notes are integrated right into Postulate's post editor, where they can be easily referenced and linked.
                </p>
            )} image={(
                <img src="/landing/feature-editor.jpg" alt="Editor feature" className="w-full shadow-lg"/>
            )}/>
            <LandingPageSection heading={(
                <>
                    Gamify the writing process
                </>
            )} text={(
                <p className="my-8">
                    Snippet-to-post conversion metrics actively push you to publish your ideas, helping you keep up your output and making writing fun.
                </p>
            )} image={(
                <img src="/landing/feature-stats.jpg" alt="Gamification feature" className="w-full shadow-lg"/>
            )}/>
            <LandingPageSection heading={(
                <>
                    A ready-out-of-the-box blog or newsletter
                </>
            )} text={(
                <>
                    <p className="my-8">
                        Publishing on Postulate is the easiest way to give your content a beautiful and powerful online home.
                    </p>
                    <div className="flex items-center my-4">
                        <div className={badgeClasses}>
                            <FiSearch/>
                        </div>
                        <p>SEO optimization</p>
                    </div>
                    <div className="flex items-center my-4">
                        <div className={badgeClasses}>
                            <BiPaint/>
                        </div>
                        <p>Beautiful design</p>
                    </div>
                    <div className="flex items-center my-4">
                        <div className={badgeClasses}>
                            <FiMail/>
                        </div>
                        <p>Email subscriptions</p>
                    </div>
                    <div className="flex items-center my-4">
                        <div className={badgeClasses}>
                            <FiMessageSquare/>
                        </div>
                        <p>Comments and reactions</p>
                    </div>
                </>
            )} image={(
                <img src="/landing/feature-blog.jpg" alt="Publishing feature" className="w-full shadow-lg"/>
            )}/>
            <LandingPageSection heading={(
                <>
                    ...or publish on the platform of your choice
                </>
            )} text={(
                <p className="my-8">
                    Use Postulate as a superpowered CMS for your publication on Medium, Ghost, NextJS, or another platform that we integrate with.
                </p>
            )} image={(
                <img src="/landing/feature-logos.png" alt="Publishing on other platforms feature" className="w-full"/>
            )}
                comingSoon={true}
            />
            <LandingPageSection heading={(
                <>
                    Save links and quotes in one click
                </>
            )} text={(
                <p className="my-8">
                    Our Chrome extension makes Postulate the easiest way to bookmark and highlight the resources you want to come back to.
                </p>
            )} image={(
                <img src="/landing/feature-chrome.svg" alt="Notetaking feature" className="w-full"/>
            )}/>
            <LandingPageSection heading={(
                <>
                    As fast as an IDE
                </>
            )} text={(
                <p className="my-8">
                    No clunky or laggy UI here: navigate through Postulate with keyboard shortcuts, quick switcher menus, and more.
                </p>
            )} image={(
                <img src="/landing/feature-shortcuts.png" alt="Notetaking feature" className="w-full"/>
            )}/>
            <div className="w-full up-primary mt-16" id="waitlist">
                <div className={containerClasses}>
                    <div className="sm:flex items-center">
                        <h2 className="flex-shrink-0 mr-8 mb-4 sm:mb-0"><b>Publish your ideas instead of forgetting them</b><br/>Sign up for the waitlist</h2>
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