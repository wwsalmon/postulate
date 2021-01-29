import {useState} from "react";
import {FiEdit2, FiBookOpen, FiHeart} from "react-icons/fi";
import Head from "next/head";
import HomeStep from "../components/home-step";
import axios from "axios";
import {WaitlistAPIRes} from "../utils/types";

export default function Home() {
    const badgeStyling = "w-12 h-12 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-xl";
    const thirdStyling = "mx-4 md:w-1/3 mb-12 md:mb-0";
    const thirdContainerStyling = "md:flex -mx-4";
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

    return (
        <>
            <Head>
                <title>Updately: Supercharge Your Creativity by Learning in public</title>
            </Head>
            <div className="px-6 mx-auto max-w-5xl flex h-16 items-center sticky top-0">
                <img src="/logo.svg" alt="Updately logo" className="h-12"/>
                <a href="#waitlist" className="up-button primary ml-auto small">Sign up for waitlist</a>
            </div>
            <div className="up-container sm:flex items-center py-16">
                <div className="sm:w-1/2 sm:pr-8 pb-8 sm:pb-0">
                    <h1 className="md:text-5xl text-4xl up-font-display font-bold leading-tight md:leading-tight mb-4">Supercharge your learning and creativity</h1>
                    <p className="md:text-2xl text-xl leading-normal md:leading-normal">Updately is an <strong>all-in-one tool</strong> for <strong>collecting and publishing your knowledge</strong>.</p>
                </div>
                <div className="sm:w-1/2">
                    <img src="/hero-diagram.svg" alt="Supercharge your learning and creativity with Updately" className="mx-auto"/>
                </div>
            </div>
            <div className="w-full up-primary" id="waitlist">
                <div className="up-container py-8">
                    <div className="sm:flex items-center">
                        <h2 className="flex-shrink-0 mr-8 mb-4 sm:mb-0">Sign up for the waitlist</h2>
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
            <div className="up-container py-8 mt-8">
                <h2 className="up-ui-item-title">Here's how it works:</h2>
                <HomeStep number={1} title={<>Jot down <strong>snippets</strong> as you build and learn </>}>
                    <div className={thirdContainerStyling + " mt-8"}>
                        <div className={thirdStyling + " opacity-75 hover:opacity-100 transition"}>
                            <p className="up-ui-title mb-4">Time-based</p>
                            <div className="shadow-xl p-4">
                                <p>Today I started building the MVP for curate.it. Using Next.js + MongoDB as my stack...</p>
                            </div>
                        </div>
                        <div className={thirdStyling + " opacity-75 hover:opacity-100 transition"}>
                            <p className="up-ui-title mb-4">Progress-based</p>
                            <div className="shadow-xl p-4">
                                <p>First, I ran <code>npx create-next-app curate.it</code>, then installed Typescript and Tailwind...</p>
                            </div>
                        </div>
                        <div className={thirdStyling + " opacity-75 hover:opacity-100 transition"}>
                            <p className="up-ui-title mb-4">Save outside resources</p>
                            <div className="shadow-xl p-4">
                                <div className="flex mb-4">
                                    <img src="/nextauth.png" alt="NextAuth.js logo" className="w-6 h-6 mr-4"/>
                                    <p>NextAuth.js | next-auth.js.org</p>
                                </div>
                                <p>Mind-blowingly easy way to set up auth in Next.js! Just create an...</p>
                            </div>
                        </div>
                    </div>
                </HomeStep>
                <hr className="my-4"/>
                <HomeStep number={2} title={<>Turn snippets into <strong>public posts</strong></>}>
                    <div className="-mx-6 md:flex mt-8 items-center opacity-50 hover:opacity-75 transition">
                        <div className="mx-6 md:w-1/3 mb-12 md:mb-0 hidden md:block">
                            <div className="shadow-xl p-4 my-4">
                                <p>Today I started building the MVP for curate.it. Using Next.js + MongoDB as my stack...</p>
                            </div>
                            <div className="shadow-xl p-4 my-4">
                                <p>First, I ran <code>npx create-next-app curate.it</code>, then installed Typescript and Tailwind...</p>
                            </div>
                            <div className="shadow-xl p-4 my-4">
                                <div className="flex mb-4">
                                    <img src="/nextauth.png" alt="NextAuth.js logo" className="w-6 h-6 mr-4"/>
                                    <p>NextAuth.js | next-auth.js.org</p>
                                </div>
                                <p>Mind-blowingly easy way to set up auth in Next.js! Just create an...</p>
                            </div>
                        </div>
                        <div className="mx-6 md:w-2/3">
                            <div className="prose content">
                                <h2># How to Build a Social Platform Using Next.js and MongoDB</h2>
                                <p>
                                    Today, I built the MVP for curate.it, a platform for expert-curated lists and social bookmarking.
                                    I used <b>**Next.js and MongoDB**</b> to build as fast as possible.
                                    In this post, I'll give an overview of my setup, libraries I used, etc. to implement <b>**posts, notifications, comments, user profiles, and more.**</b>
                                </p>
                            </div>
                        </div>
                    </div>
                </HomeStep>
                <hr className="my-4"/>
                <HomeStep number={3} title={<><strong>Share your knowledge</strong> through profile and project pages</>}>
                    <div className="-mx-6 md:flex mt-12 opacity-50 hover:opacity-75 transition">
                        <div className="mx-6 md:w-1/3 mb-12 md:mb-0">
                            <div className="flex items-center">
                                <img src="/sz-headshot.jpg" alt="Profile picture of Samson Zhang" className="rounded-full w-12 h-12 mr-4"/>
                                <p className="content">Samson Zhang</p>
                            </div>
                            <hr className="my-4"/>
                            <p className="up-ui-title">Projects</p>
                            <p className="my-2">curate.it (4)</p>
                            <p className="my-2">Physics research (2)</p>
                            <p className="my-2">Revolutionary reading club (1)</p>
                            <hr className="my-4"/>
                            <p className="up-ui-title">Tags</p>
                            <p className="my-2">#nextjs (4)</p>
                            <p className="my-2">#webdev (4)</p>
                            <p className="my-2">#swe (4)</p>
                        </div>
                        <div className="mx-6 md:w-2/3">
                            <div className="mb-8">
                                <p className="up-ui-item-title mb-2">How to Build a Social Platform Using Next.js and MongoDB</p>
                                <p>April 10 in curate.it <b className="opacity-50">#nextjs #mongodb #webdev #swe</b></p>
                            </div>
                            <div className="mb-8">
                                <p className="up-ui-item-title mb-2">How Do Transistors Work? The Building Blocks of Modern Computing</p>
                                <p>April 2 in Physics Research <b className="opacity-50">#engineering #physics</b></p>
                            </div>
                            <div className="mb-8">
                                <p className="up-ui-item-title mb-2">The Importance of Theory to Revolution | Notes on Lenin's "What Is to Be Done?", Chapter 1</p>
                                <p>March 27 in Revolutionary Reading Club <b className="opacity-50">#book #socialscience</b></p>
                            </div>
                        </div>
                    </div>
                </HomeStep>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-item-title mb-8">Updately is...</h2>
                <div className={thirdContainerStyling}>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiBookOpen/>
                        </div>
                        <h3 className="content mb-2">Your go-to knowledge base</h3>
                        <p className="up-ui-subtitle">All your thoughts, links, and work in one place</p>
                    </div>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiEdit2/>
                        </div>
                        <h3 className="content mb-2">A robust brainstorming and writing tool</h3>
                        <p className="up-ui-subtitle">Connect your ideas together through snippets and write in a beautiful WYSIWYG markdown editor</p>
                    </div>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiHeart/>
                        </div>
                        <h3 className="content mb-2">An authentic public presence</h3>
                        <p className="up-ui-subtitle">The best way to show off your projects and personal growth</p>
                    </div>
                </div>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-item-title mb-8">The Updately manifesto</h2>
                <p className="up-font-display text-3xl leading-normal my-8">"...among all notetaking strategies, the <b>only one that actually simplifies knowledge management</b> and makes it more effective is to <b>publish your learning, experiences, and insights in public.</b>"</p>
                <p className="content">Read founder Samson Zhang's blog post <a href="https://www.samsonzhang.com/2021/01/27/how-i-use-learning-in-public-as-my-personal-knowledge-management-strategy.html" className="underline">How I Use Learning in Public as My Personal Knowledge Management Strategy</a></p>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <p>
                    Follow <a href="https://twitter.com/updatelyapp" className="underline">Updately on Twitter</a>.
                    Built with ♥ by <a href="https://twitter.com/wwsalmon" className="underline">Samson Zhang</a>
                </p>
            </div>
        </>
    )
}