import {AppProps} from "next/app";
import "../styles/globals.css";
import Navbar from "../components/navbar";
import {Provider} from "next-auth/client";
import Router, {useRouter} from "next/router";
import Modal from "react-modal";
import Footer from "../components/footer";
import NProgress from "nprogress";
import "../styles/nprogress.css";
import {createContext, useState} from "react";

Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
});
Router.events.on("routeChangeComplete", (url) => {
    // @ts-ignore window.analytics undefined below
    window.analytics.page(url);
    NProgress.done();
});
Router.events.on("routeChangeError", () => NProgress.done());

export const NotifsContext = createContext(null);

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const [notifsIteration, setNotifsIteration] = useState<number>(0);

    return (
        <NotifsContext.Provider value={{notifsIteration, setNotifsIteration}}>
            <Provider session={pageProps.session}>
                {router.route !== "/" && (
                    <Navbar/>
                )}
                <div id="app-root">
                    <Component {...pageProps} />
                </div>
                {router.route !== "/" && (
                    <Footer/>
                )}
            </Provider>
        </NotifsContext.Provider>
    )
}

Modal.setAppElement("#app-root");
