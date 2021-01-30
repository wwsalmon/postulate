import {AppProps} from "next/app";
import '../styles/globals.css'
import Navbar from "../components/navbar";
import {Provider} from "next-auth/client";
import {useRouter} from "next/router";
import Modal from "react-modal";

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
        </Provider>
    )
}

Modal.setAppElement("#app-root");
