import {ReactNode} from "react";
import {useFocused, useSelected} from "slate-react";
import {InlineMath} from "react-katex";
import {CustomElement} from "./slate-types";
import {Node} from "slate";

export default function InlineTex({
                                      attributes,
                                      children,
                                      element
                                  }: { attributes: any, children: ReactNode, element: CustomElement }) {
    const focused = useFocused();
    const selected = useSelected();
    const showSource = focused && selected;

    const math = Node.string(element);

    let divProps = {
        ...attributes,
        className: "relative inline px-1 " + (showSource ? "border border-gray-300 py-2" : ""),
    };

    const isEmpty = math === "  ";

    return (
        <div {...divProps}>
            <span className={"font-mono text-sm " + (showSource ? "" : "text-center absolute top-1/2 left-0 -translate-y-1/2 w-full opacity-0")}>
                {children}
                {showSource && (
                    <div
                        contentEditable={false}
                        className="absolute select-none bg-gray-100 top-0 border border-gray-300 font-bold"
                        style={{fontSize: 8, paddingLeft: 2, paddingRight: 2, transform: "translateY(-100%)", left: -1}}
                    >
                        <span>LaTeX</span>
                    </div>
                )}
            </span>
            {!showSource && (
                <span contentEditable={false} className={"pointer-events-none " + (isEmpty ? "opacity-25" : "")}>
                    <InlineMath math={isEmpty ? "\\LaTeX" : math}/>
                </span>
            )}
        </div>
    );
}