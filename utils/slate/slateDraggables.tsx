import {
    createSlatePluginsComponents,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TABLE,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    withDraggables
} from "@udecode/slate-plugins";
import {BiGridVertical} from "react-icons/bi";

let components = createSlatePluginsComponents();
components["loading"] = props => (
    <div style={{padding: "0.5rem", backgroundColor: "#e2e2e2", userSelect: "none"}} contentEditable={false}>
        <span>Loading...</span>
        {props.children}
    </div>
);

const draggableComponents = withDraggables(components, [
    {
        keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
        level: 0,
    },
    {
        keys: [
            ELEMENT_PARAGRAPH,
            ELEMENT_BLOCKQUOTE,
            ELEMENT_TODO_LI,
            ELEMENT_H2,
            ELEMENT_H3,
            ELEMENT_H4,
            ELEMENT_H5,
            ELEMENT_H6,
            ELEMENT_IMAGE,
            ELEMENT_OL,
            ELEMENT_UL,
            ELEMENT_TABLE,
            ELEMENT_MEDIA_EMBED,
            ELEMENT_CODE_BLOCK,
        ],
        dragIcon: (
            <BiGridVertical/>
        ),
    },
    {
        key: ELEMENT_H2,
        styles: {
            gutterLeft: {
                paddingTop: "3em",
            }
        }
    },
    {
        key: ELEMENT_H3,
        styles: {
            gutterLeft: {
                paddingTop: "2.5em",
            }
        }
    },
    {
        keys: [ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
        styles: {
            gutterLeft: {
                paddingTop: "2em",
            }
        }
    },
    {
        keys: [ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
        styles: {
            gutterLeft: {
                paddingTop: "2em",
            }
        }
    },
    {
        keys: [
            ELEMENT_PARAGRAPH,
            ELEMENT_TODO_LI,
            ELEMENT_IMAGE,
            ELEMENT_OL,
            ELEMENT_UL,
            ELEMENT_TABLE,
            ELEMENT_MEDIA_EMBED,
        ],
        styles: {
            gutterLeft: {
                paddingTop: "0.75em",
            }
        }
    }
]);

export default draggableComponents;