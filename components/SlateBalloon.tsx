import {
    BalloonToolbar,
    ELEMENT_H2,
    MARK_BOLD,
    MARK_ITALIC,
    ToolbarElement,
    ToolbarLink,
    ToolbarMark,
    useSlatePluginType
} from "@udecode/slate-plugins";
import {BiBold, BiHeading, BiItalic, BiLink} from "react-icons/bi";

export default function SlateBalloon() {
    return (
        <BalloonToolbar>
            <ToolbarMark
                type={useSlatePluginType(MARK_BOLD)}
                icon={<BiBold/>}
            />
            <ToolbarMark
                type={useSlatePluginType(MARK_ITALIC)}
                icon={<BiItalic/>}
            />
            <ToolbarLink icon={<BiLink/>}/>
            <ToolbarElement type={useSlatePluginType(ELEMENT_H2)} icon={<BiHeading/>}/>
        </BalloonToolbar>
    )
}