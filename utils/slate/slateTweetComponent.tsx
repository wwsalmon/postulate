import {Tweet} from "react-twitter-widgets";

export const slateTweetComponent = ({attributes, children, element}) => (
    <div {...attributes} contentEditable={false}>
        <Tweet tweetId={element.tweetId}/>
        {children}
    </div>
);