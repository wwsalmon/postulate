import axios from "axios";
import React, {useState} from "react";
import {WaitlistAPIRes} from "../../utils/types";
import SEO from "../../components/standard/SEO";
import Link from "next/link";
import UiButton from "../../components/style/UiButton";
import {FiArrowDown, FiSearch} from "react-icons/fi";
import Button from "../../components/headless/Button";
import Sections from "../../components/lander/v3";
import Footer from "../../components/lander/Footer";
import SignInButton from "../../components/standard/SignInButton";
import {signIn} from "next-auth/react";
import {FaGoogle} from "react-icons/fa";

export default function Home() {
    return (
        <>
            <SEO/>
            <div className="w-full absolute top-0 z-50 flex items-center text-white">
                <Link href="/explore">
                    <a className="mt-4 flex items-center opacity-75 hover:opacity-100 transition ml-4">
                        <div className="mr-3">
                            <FiSearch/>
                        </div>
                        Explore
                    </a>
                </Link>
                <Link href="/auth/signin">
                    <a className="ml-auto mt-4 mr-8 opacity-75 hover:opacity-100 transition">
                        Sign in
                    </a>
                </Link>
            </div>
            <div className="w-full border-b up-border-gray-200" style={{
                background: "linear-gradient(60deg, rgba(2,1,31,1) 5%, rgba(5,25,138,1) 26%, rgba(0,212,255,1) 95%)",
            }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-20 pb-[600px]">
                    <img src="/postulate-tile.svg" className="w-12 h-12 mb-16" alt="Postulate logo"/>
                    <h1 className="text-white font-manrope text-3xl sm:text-4xl leading-normal sm:leading-normal">
                        <span>Postulate is </span>
                        <span className="font-bold">GitHub for knowledge: </span>
                        <br className="hidden sm:block"/>
                        <span>a notetaking app for </span>
                        <span className="font-bold">sharing your thoughts, <br className="hidden sm:block"/>learning, and work </span>
                        <span>with the world.</span>
                    </h1>
                    <p className="my-10 text-white opacity-75 content leading-relaxed">
                        Effortlessly capture notes and research. Turn them into written content. <br className="hidden sm:block"/>10x your learning and writing output with Postulate.
                    </p>
                    <div className="mt-12 flex">
                        <Button
                            className="bg-white p-2 rounded-md sm:text-xl"
                            onClick={() => signIn("google")}
                        >
                            <div className="flex items-center">
                                <FaGoogle/><span className="ml-2">Start learning in public</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <img src="/hero.png" alt="Hero banner" className="w-full hidden sm:block -mt-[500px]"/>
            <img src="/hero-mobile.png" alt="Hero banner" className="w-full sm:hidden -mt-[500px]"/>
            <div className="max-w-6xl mx-auto px-4">
                <Sections/>
                <hr className="my-24"/>
                <SignInButton className="my-24 mx-auto block">Learn in public with Postulate</SignInButton>
            </div>
            <Footer/>
        </>
    )
}