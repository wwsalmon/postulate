import axios from "axios";
import {useState} from "react";
import {WaitlistAPIRes} from "../utils/types";
import UpSEO from "../components/up-seo";
import Head from "next/head";

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

    const heroSansStyle = {fontSize: 43, fontWeight: 300};
    const heroSerifStyle = {fontSize: 48, fontFamily: "Alegreya", fontStyle: "italic"};

    return (
        <>
            <UpSEO/>
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
            <div className="max-w-6xl mx-auto px-4 py-20">
                <img src="/postulate-tile.svg" className="w-12 h-12 mb-20" alt="Postulate logo"/>
                <h1 style={{lineHeight: "56px"}}>
                    <span style={heroSansStyle}>Postulate is </span>
                    <span style={heroSerifStyle}>GitHub for knowledge: </span>
                    <br/>
                    <span style={heroSansStyle}>a notetaking app for </span>
                    <span style={heroSerifStyle}>sharing your thoughts,<br/>learning, and work </span>
                    <span style={heroSansStyle}>with the world.</span>
                </h1>
                <p className="my-10 up-gray-500 content leading-relaxed">
                    Effortlessly capture notes and research. Link and reference them as you write, or<br/>publish them directly. Anyone can start sharing knowledge with Postulate.
                </p>
            </div>
        </>
    )
}