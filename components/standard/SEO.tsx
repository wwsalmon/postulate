import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function SEO({
    title,
    description = "The best place to publish blog posts and reading notes about what you learn in classes, research, and personal projects.",
    projectName,
    imgUrl,
    authorUsername,
    publishedDate,
    noindex = false,
}: { title?: string, description?: string, projectName?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title ? (title + (projectName ? ` | ${projectName} on Postulate` : " | Postulate")) : "Postulate: GitHub for Knowledge";

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