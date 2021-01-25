import {FiSpeaker, FiBookOpen, FiSearch, FiMessageCircle, FiEdit2, FiSettings} from "react-icons/fi";
import Head from "next/head";

export default function Home() {
    const badgeStyling = "w-12 h-12 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-xl";

    return (
        <>
            <Head>
                <title>Updately: The best platform for founders and teams to build in public</title>
            </Head>
            <div className="up-container flex h-16 items-center sticky top-0">
                <img src="/logo.svg" alt="Updately logo" className="h-12"/>
                <button className="up-button primary ml-auto small" disabled>Coming soon</button>
            </div>
            <div className="up-container sm:flex items-center py-16">
                <div className="sm:w-1/2 sm:pr-8 pb-8 sm:pb-0">
                    <h1 className="up-h1 mb-4">Build in public</h1>
                    <p className="content">Updately is the best place for founders and teams to share their work, as
                        they do it.</p>
                </div>
                <div className="sm:w-1/2">
                    <img src="/home-mock.png" alt="Homepage mockup of Updately" className="shadow-xl"/>
                </div>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-title pb-8">Why build in public?</h2>
                <div className="md:flex md:-mx-4">
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiSpeaker/>
                        </div>
                        <h3 className="content mb-2">Put yourself out there</h3>
                        <p className="up-ui-subtitle">Drive organic traffic to your project</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiBookOpen/>
                        </div>
                        <h3 className="content mb-2">Build a knowledge base</h3>
                        <p className="up-ui-subtitle">A continuous record for you and your team to reference</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiSearch/>
                        </div>
                        <h3 className="content mb-2">Attract talent, investors, or jobs</h3>
                        <p className="up-ui-subtitle">Maximize opportunity by showing your work to the world</p>
                    </div>
                </div>
            </div>
            <hr className="my-8"/>
            <div className="up-container py-8">
                <h2 className="up-ui-title pb-8">Why use Updately?</h2>
                <div className="md:flex md:-mx-4">
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiSettings/>
                        </div>
                        <h3 className="content mb-2">Zero config setup</h3>
                        <p className="up-ui-subtitle">Forget about setting up a blog. Just sign up and start writing</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiEdit2/>
                        </div>
                        <h3 className="content mb-2">Beautiful writing experience</h3>
                        <p className="up-ui-subtitle">Write in our meticulously crafted WYSIWYG markdown editor</p>
                    </div>
                    <div className="md:w-1/3 md:mx-4 mb-12 md:mb-0">
                        <div className={badgeStyling}>
                            <FiMessageCircle/>
                        </div>
                        <h3 className="content mb-2">Engage with your audience</h3>
                        <p className="up-ui-subtitle">Handle email notifications, comments, and more right on Updately</p>
                    </div>
                </div>
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