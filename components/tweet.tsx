export default function Tweet({id}: {id: string}) {
    return (
        <iframe
            id="twitter-widget-0"
            scrolling="no"
            frameBorder="0"
            allowTransparency
            allowFullScreen
            className="w-full mx-auto block h-auto"
            src={`https://platform.twitter.com/embed/Tweet.html?origin=https%3A%2F%2Fpostulate%2Eus%2F&hideThread=false&id=${id}&lang=en&siteScreenName=postulate&widgetsVersion=e1ffbdb%3A1614796141937`}
            data-tweet-id={id}
        />
    )
}