import {
    BalloonToolbar,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_STRIKETHROUGH, ToolbarLink,
    ToolbarMark,
    useSlatePluginType
} from "@udecode/slate-plugins";
import {BiBold, BiItalic, BiLink, BiStrikethrough} from "react-icons/bi";

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
            <ToolbarMark
                type={useSlatePluginType(MARK_STRIKETHROUGH)}
                icon={<BiStrikethrough/>}
            />
            <ToolbarLink icon={<BiLink/>}/>
        </BalloonToolbar>
    )
}