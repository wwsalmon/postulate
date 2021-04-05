import {useState} from "react";
import {FiBookOpen, FiEdit, FiGlobe} from "react-icons/fi";
import HomeStep from "../components/home-step";
import axios from "axios";
import {WaitlistAPIRes} from "../utils/types";
import UpSEO from "../components/up-seo";

export default function Home() {
    const badgeStyling = "w-12 h-12 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-xl";
    const thirdStyling = "mx-4 md:w-1/3 mb-12 md:mb-0 opacity-75 hover:opacity-100 transition";
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

    const containerClasses = "px-4 mx-auto max-w-5xl py-8";

    return (
        <>
            <UpSEO/>
            <div className="w-full bg-white sticky top-0">
                <div className="px-4 mx-auto max-w-5xl flex h-16 items-center">
                    <img src="/logo.svg" alt="Postulate logo" className="h-10"/>
                    <a href="#waitlist" className="up-button primary ml-auto small">Sign up for waitlist</a>
                </div>
            </div>
            <div className="px-4 mx-auto max-w-5xl py-16 text-center">
                <h1 className="max-w-2xl mx-auto md:text-5xl text-4xl up-font-display leading-tight md:leading-tight mb-8">
                    <code className="text-2xl md:text-4xl bg-gray-200 p-2 rounded-md font-bold">10x</code> your <b>learning and writing output</b> by <b>taking public notes</b>
                </h1>
                {/*<hr className="my-10 max-w-sm mx-auto"/>*/}
                <p className="max-w-xl mx-auto md:text-2xl text-xl leading-normal md:leading-normal">Postulate is a a notetaking platform that helps you <b>publish your ideas instead of forgetting them.</b></p>
                <img src="/sc1.jpg" alt="" className="max-w-xl mx-auto block shadow-xl my-10 w-full"/>
            </div>
            <div className="w-full up-primary" id="waitlist">
                <div className={containerClasses}>
                    <div className="sm:flex items-center">
                        <h2 className="flex-shrink-0 mr-8 mb-4 sm:mb-0"><b>Currently in closed beta</b><br/>Sign up for the waitlist</h2>
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
                <h2 className="up-ui-item-title mb-8">What users say</h2>
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
            <hr className="my-8"/>
            <div className={containerClasses}>
                <h2 className="up-ui-item-title mb-8">Postulate is...</h2>
                <div className={thirdContainerStyling}>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiEdit/>
                        </div>
                        <h3 className="text-xl mb-2 font-bold">Your catch-all notetaking tool</h3>
                        <p className="up-ui-subtitle">Record your ideas, work, reading, or anything else</p>
                    </div>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiGlobe/>
                        </div>
                        <h3 className="text-xl mb-2 font-bold">An effortless blogging platform</h3>
                        <p className="up-ui-subtitle">Beautiful, shareable posts, minus any hassle</p>
                    </div>
                    <div className={thirdStyling}>
                        <div className={badgeStyling}>
                            <FiBookOpen/>
                        </div>
                        <h3 className="text-xl mb-2 font-bold">The world's comprehensive knowledge base</h3>
                        <p className="up-ui-subtitle">A home for everything you - and everyone else on earth - have learned</p>
                    </div>
                </div>
            </div>
            <hr className="my-8"/>
            <div className={containerClasses}>
                <h2 className="up-ui-item-title mb-8">The Postulate manifesto</h2>
                <p className="up-font-display text-3xl leading-normal my-8">"...among all notetaking strategies, the <b>only one that actually simplifies knowledge management</b> and makes it more effective is to <b>publish your learning, experiences, and insights in public.</b>"</p>
                <p className="content">Read founder Samson Zhang's blog post <a href="https://www.samsonzhang.com/2021/01/27/how-i-use-learning-in-public-as-my-personal-knowledge-management-strategy.html" className="underline">How I Use Learning in Public as My Personal Knowledge Management Strategy</a></p>
            </div>
            <hr className="my-8"/>
            <div className="px-4 mx-auto max-w-5xl py-8 mt-8">
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
            <div className={containerClasses}>
                <h2 className="up-ui-item-title mb-8">Pricing</h2>
                <div className={thirdContainerStyling}>
                    <div className={thirdStyling}>
                        <h3 className="text-2xl">Free</h3>
                        <div className="prose">
                            <p>Free forever</p>
                            <ul>
                                <li>Unlimited snippets</li>
                                <li>Unlimited posts</li>
                                <li>Up to 5 projects</li>
                            </ul>
                        </div>
                    </div>
                    <div className={thirdStyling}>
                        <h3 className="text-2xl">Professional</h3>
                        <div className="prose">
                            <p>$5 / month</p>
                            <ul>
                                <li>Everything in Free, plus...</li>
                                <li>Unlimited projects</li>
                                <li>Share projects with collaborators</li>
                            </ul>
                        </div>
                    </div>
                    <div className={thirdStyling}>
                        <h3 className="text-2xl">Creator</h3>
                        <div className="prose">
                            <p>$10 / month</p>
                            <ul>
                                <li>Everything in Professional, plus...</li>
                                <li>Customize project page</li>
                                <li>Email subscriptions for projects</li>
                                <li>Monetize your content</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
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