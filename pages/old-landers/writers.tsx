import {useState} from "react";
import {FiMail, FiMessageSquare, FiSearch} from "react-icons/fi";
import axios from "axios";
import {WaitlistAPIRes} from "../../utils/types";
import SEO from "../../components/standard/SEO";
import Head from "next/head";
import InlineButton from "../../components/style/InlineButton";
import LandingPageSection from "../../components/lander/LandingPageSection";
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
            <SEO/>
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
                    <InlineButton href="/auth/signin" className="ml-auto hidden sm:inline-block">Sign in</InlineButton>
                    <a href="#waitlist" className="up-button primary small ml-auto sm:ml-4">Sign up for waitlist</a>
                </div>
            </div>
            <div className="w-full" id="waitlist">
                <div className="my-16 text-white sm:text-center up-primary relative z-10 px-4 mx-auto">
                    <h1 className="up-font-display text-3xl sm:text-4xl" style={{lineHeight: 1.2}}>
                        Postulate is a notetaking app that helps you write <br className="hidden md:block"/><b>faster and with more confidence</b> than ever before.
                    </h1>
                    <p className="max-w-3xl mx-auto sm:text-xl my-8">Keep your notes and research in one place. Link and reference them as you write. Supercharge your blog or newsletter writing process with Postulate.</p>
                    <div className="mt-12 flex">
                        {submitted ? (
                                <p className="mx-auto">
                                    You are in <strong>position {submitted && submitted.data.current_priority}</strong>.
                                    Get your friends to sign up with this link to move up in the list: <code>{submitted && submitted.data.referral_link}</code>
                                </p>
                        ) : (
                            <div className="mx-auto flex flex-col sm:flex-row w-full sm:w-auto">
                                <input
                                    type="text"
                                    className="p-2 rounded-md text-black w-full sm:w-auto"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button className="up-button primary ml-auto mt-2 sm:ml-4 sm:mt-0" onClick={onWaitlistSubmit}>Sign up for waitlist</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <div className="w-full up-primary absolute left-0" style={{transform: "skew(0deg, -5deg)", height: "100vh", top: "calc(-100vh + 30%)"}}/>
                    <img src="/sc2.png" alt="Hero image" className="max-w-3xl px-4 w-full mx-auto block relative mb-24"/>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4">
                <hr className="my-16"/>
                <div className="lg:flex items-center">
                    <div className="lg:w-64 mb-4 lg:mb-0">
                        <img src="/annia.jpg" className="w-16 h-16 rounded-full mb-4" alt="Photo of Annia Mirza, author of Legit"/>
                        <p className="content"><b>Annia Mirza</b></p>
                        <p>Uses Postulate to write weekly newsletters for 2K+ <a href="https://www.readlegit.com/" className="underline">Legit.</a> subscribers</p>
                    </div>
                    <div className="prose up-font-display lg:ml-auto content">
                        <p>"My old note-taking process felt incredibly splintered - I was pasting links I would later lose and  jotting down notes I would later forget about in the process of hopping to and from Notion and Google Docs.</p>
                        <p>"Postulate has <b>consolidated this entire process:</b> it lets me quickly jot down notes and thoughts as they occur, easily save links (and connect these link to my notes so I never forget about them!) and, overall, has made me a <b>calmer, less sporadic writer.</b>"</p>
                    </div>
                </div>
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
                    As fast as an IDE
                </>
            )} text={(
                <p className="my-8">
                    No clunky or laggy UI here: navigate through Postulate with keyboard shortcuts, quick switcher menus, and more.
                </p>
            )} image={(
                <img src="/landing/feature-shortcuts.png" alt="Notetaking feature" className="w-full"/>
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
            <div className="w-full up-primary mt-16" id="waitlist">
                <div className={containerClasses}>
                    <div className="md:flex items-center">
                        <h2 className="flex-shrink-0 mr-8 mb-4 md:mb-0"><b>Write faster and with more confidence than ever before</b><br/>Sign up for the waitlist</h2>
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