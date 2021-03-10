import {AppProps} from "next/app";
import "../styles/globals.css";
import Navbar from "../components/navbar";
import {Provider} from "next-auth/client";
import Router, {useRouter} from "next/router";
import Modal from "react-modal";
import Footer from "../components/footer";
import NProgress from "nprogress";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", (url) => {
    console.log(`Loading: ${url}`)
    NProgress.start()
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();

    return (
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
    )
}

Modal.setAppElement("#app-root");
