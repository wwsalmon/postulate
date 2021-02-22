import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function UpSEO({
    title = "Postulate: Supercharge Your Creativity by Learning in public",
    description = "Postulate is an all-in-one tool for you to collect and publish your knowledge.",
    projectName = "",
    imgUrl = null,
}: { title?: string, description?: string, projectName?: string, imgUrl?: string }) {
    const router = useRouter();
    const fullTitle = title + (projectName ? ` | ${projectName} on Postulate` : " | Postulate");

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            openGraph={{
                title: fullTitle,
                description: description,
                url: "https://postulate.us" + router.asPath,
                images: imgUrl ? [
                    { url: imgUrl }
                ] : [],
            }}
        />
    );
}