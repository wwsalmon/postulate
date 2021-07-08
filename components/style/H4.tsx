import {ReactNode} from 'react';

export default function H4({children, className} : {children: ReactNode, className?: string}) {
  return (
    <h4 className={"font-bold " + (className || "")}>
        {children}
    </h4>
  );
}