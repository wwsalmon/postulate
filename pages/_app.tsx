import {AppProps} from "next/app";
import '../styles/globals.css'
import Navbar from "../components/navbar";
import {Provider} from "next-auth/client";
import {useRouter} from "next/router";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();

    return (
        <Provider session={pageProps.session}>
            {router.route !== "/" && (
                <Navbar/>
            )}
            <Component {...pageProps} />
        </Provider>
    )
}
