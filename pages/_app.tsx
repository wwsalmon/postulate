import {AppProps} from "next/app";
import "../styles/globals.css";
import Navbar from "../components/navbar/Navbar";
import {SessionProvider} from "next-auth/react";
import Router, {useRouter} from "next/router";
import Modal from "react-modal";
import Footer from "../components/navbar/Footer";
import NProgress from "nprogress";
import "../styles/nprogress.css";
import {createContext, useState} from "react";
import {ToastProvider} from "react-toast-notifications";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

Router.events.on("routeChangeStart", (url, {shallow}) => {
    if (!shallow) NProgress.start();
});
Router.events.on("routeChangeComplete", (url, {shallow}) => {
    // @ts-ignore window.analytics undefined below
    window.analytics.page(url);
    if (!shallow) NProgress.done();
});
Router.events.on("routeChangeError", () => NProgress.done());

export const NotifsContext = createContext(null);

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const [notifsIteration, setNotifsIteration] = useState<number>(0);

    return (
        <NotifsContext.Provider value={{notifsIteration, setNotifsIteration}}>
            <SessionProvider session={pageProps.session}>
                {!["/old-landers/github", "/old", "/writers"].includes(router.route) && (
                    <ToastProvider>
                        <Navbar/>
                    </ToastProvider>
                )}
                <div id="app-root">
                    <Component {...pageProps} />
                </div>
                {/*{router.route !== "/" && (*/}
                {/*    <Footer/>*/}
                {/*)}*/}
            </SessionProvider>
        </NotifsContext.Provider>
    )
}

Modal.setAppElement("#app-root");
TimeAgo.addDefaultLocale(en);