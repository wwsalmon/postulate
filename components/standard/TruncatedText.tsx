import {Node} from "slate";
import {SlateReadOnly} from "../../slate/SlateEditor";
import React from "react";

const TruncatedText = ({value}: {value: Node[]}) => (
    <div className="max-h-32 text-gray-500 truncate relative mix-blend-hard-multiply">
        <SlateReadOnly
            value={value}
            fontSize={14}
            className="text-gray-400"
        />
        <div className="w-full absolute top-24 left-0 h-8 bg-gradient-to-t from-white"></div>
    </div>
);

export default TruncatedText;