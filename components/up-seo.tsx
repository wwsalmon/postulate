import {NextSeo} from "next-seo";

export default function UpSEO({
                                  title = "Updately: Supercharge Your Creativity by Learning in public",
                                  description = "Updately is an all-in-one tool for you to collect and publish your knowledge."
}: { title?: string, description?: string }) {
    return (
        <NextSeo
            title={title + " | Updately"}
            description={description}
        />
    );
}