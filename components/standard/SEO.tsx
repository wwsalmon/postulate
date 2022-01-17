import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function SEO({
    title = "Postulate: Supercharge Your Creativity by Learning in public",
    description = "Postulate is an all-in-one tool for you to collect and publish your knowledge.",
    projectName = "",
    imgUrl = null,
    authorUsername = null,
    publishedDate = null,
    noindex = false,
}: { title?: string, description?: string, projectName?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title + (projectName ? ` | ${projectName} on Postulate` : " | Postulate");

    let openGraph = {
        title: fullTitle,
        description: description,
        url: "https://postulate.us" + router.asPath,
        images: imgUrl ? [
            { url: imgUrl }
        ] : [
            { url: "https://postulate.us/postulate-square.png" }
        ],
    };

    let twitter = {
        site: "@postulate",
        cardType: imgUrl ? "summary_large_image" : "summary",
    };

    // if post page, add article info to openGraph
    if (router.pathname === "/[username]/p/[postUrlName]" && publishedDate && authorUsername) {
        openGraph["article"] = {
            publishedTime: publishedDate,
                authors: [
                `https://postulate.us/@${authorUsername}`,
            ]
        }
    };

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            openGraph={openGraph}
            twitter={twitter}
            noindex={noindex}
        />
    );
}