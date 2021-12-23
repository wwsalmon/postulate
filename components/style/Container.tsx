import {ReactNode} from "react";

export default function Container({children, className} : {children: ReactNode, className?: string}) {
  return (
    <div className={"mx-auto px-4 max-w-4xl " + (className || "")}>
        {children}
    </div>
  );
}