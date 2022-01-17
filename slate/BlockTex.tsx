import {ReactNode} from "react";
import {useFocused, useSelected} from "slate-react";
import {BlockMath} from "react-katex";
import {CustomElement} from "./slate-types";
import {Node} from "slate";

export default function BlockTex({
                                      attributes,
                                      children,
                                      element
                                  }: { attributes: any, children: ReactNode, element: CustomElement }) {
    const focused = useFocused();
    const selected = useSelected();
    const showSource = focused && selected;

    const math = Node.string(element);

    const isEmpty = math === "";

    let divProps = {
        ...attributes,
        className: "relative px-1 " + (showSource ? "border border-gray-300 py-2 " : "overflow-x-auto "),
    };

    return (
        <div {...divProps}>
            <div className={"font-mono text-sm text-center " + (showSource ? "" : "absolute top-1/2 left-0 -translate-y-1/2 w-full opacity-0")}>
                {children}
                {showSource && (
                    <div
                        contentEditable={false}
                        className="absolute pointer-events-none bg-gray-100 top-0 border border-gray-300 font-bold"
                        style={{fontSize: 8, paddingLeft: 2, paddingRight: 2, transform: "translateY(-100%)", left: -1}}
                    >
                        <span>LaTeX</span>
                    </div>
                )}
            </div>
            {!showSource && (
                <div className={"pointer-events-none " + (isEmpty ? "opacity-25" : "")} contentEditable={false}>
                    <BlockMath math={isEmpty ? "\\LaTeX" : math}/>
                </div>
            )}
        </div>
    );
}