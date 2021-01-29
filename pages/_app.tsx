import {AppProps} from "next/app";
import '../styles/globals.css'
import Navbar from "../components/navbar";
import {Provider} from "next-auth/client";

export default function App({Component, pageProps}: AppProps) {
    return (
        <Provider session={pageProps.session}>
            <Navbar/>
            <Component {...pageProps} />
        </Provider>
    )
}
