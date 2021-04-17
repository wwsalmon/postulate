import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import {Node} from "slate";
import {options, pluginsFactory} from "../utils/slate/slatePlugins";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {SlatePlugins} from "@udecode/slate-plugins";
import draggableComponents from "../utils/slate/slateDraggables";
import SlateBalloon from "./SlateBalloon";
import SlatePlaceholder from "./SlatePlaceholder";

export default function SlateEditor({body, setBody, projectId, urlName, isPost}: {
    body: Node[],
    setBody: Dispatch<SetStateAction<Node[]>>,
    projectId: string,
    urlName: string,
    isPost: boolean,
}) {
    const pluginsMemo = useMemo(() => pluginsFactory(projectId, urlName, isPost), []);

    return (
        <DndProvider backend={HTML5Backend}>
            <SlatePlugins
                id="testId"
                value={body}
                onChange={newValue => setBody(newValue)}
                plugins={pluginsMemo}
                components={draggableComponents}
                options={options}
            >
                <SlateBalloon/>
                <SlatePlaceholder/>
            </SlatePlugins>
        </DndProvider>
    );
}