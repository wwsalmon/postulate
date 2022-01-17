import {Node} from "slate";
import {SlateReadOnly} from "../../slate/SlateEditor";
import React from "react";

const TruncatedText = ({value, isSmall}: {value: Node[], isSmall?: boolean}) => (
    <div className={`${isSmall ? "max-h-16" : "max-h-32"} text-gray-500 truncate relative mix-blend-hard-multiply`}>
        <SlateReadOnly
            value={value}
            fontSize={14}
            className="text-gray-400"
        />
        <div className={`w-full absolute ${isSmall ? "top-8" : "top-24"} left-0 h-8 bg-gradient-to-t from-white`}/>
    </div>
);

export default TruncatedText;