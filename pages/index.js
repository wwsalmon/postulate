import {FiEdit2, FiBookOpen, FiHeart} from "react-icons/fi";
import Head from "next/head";
import HomeStep from "../components/home-step";

export default function Home() {
    const badgeStyling = "w-12 h-12 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-xl";

    return (
        <>
            <Head>
                <title>Updately: Supercharge Your Creativity by Learning in public</title>
            </Head>
            <div className="up-container flex h-16 items-center sticky top-0">
                <img src="/logo.svg" alt="Updately logo" className="h-12"/>
                <button className="up-button primary ml-auto small" disabled>Coming soon</button>
            </div>
            <div className="up-container sm:flex items-center py-16">
                <div className="sm:w-1/2 sm:pr-8 pb-8 sm:pb-0">
                    <h1 className="text-5xl up-font-display font-bold leading-tight mb-4">Supercharge your learning and creativity</h1>
                    <p className="text-2xl leading-normal">Updately is an all-in-one tool for collecting and publishing your knowledge.</p>
                </div>
                <div className="sm:w-1/2">
                    <img src="/hero-diagram.svg" alt="Supercharge your learning and creativity with Updately" className="ml-auto"/>
                </div>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-item-title">How it works</h2>
                <HomeStep number={1} title={<>Jot down <strong>snippets</strong> as you build and learn </>}/>
                <HomeStep number={2} title="Turn snippets into public posts">
                    <p>Testing</p>
                </HomeStep>
                <HomeStep number={3} title="Share knowledge on profile and project pages">
                    <p>Testing</p>
                </HomeStep>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-item-title mb-8">Updately is...</h2>
                <div className="md:flex md:-mx-4">
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiBookOpen/>
                        </div>
                        <h3 className="content mb-2">Your go-to knowledge base</h3>
                        <p className="up-ui-subtitle">All your thoughts, links, and work in one place</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiEdit2/>
                        </div>
                        <h3 className="content mb-2">A robust brainstorming and writing tool</h3>
                        <p className="up-ui-subtitle">Connect your ideas together through snippets and write in a beautiful WYSIWYG markdown editor</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
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