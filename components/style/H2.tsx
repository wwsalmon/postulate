import {ReactNode} from 'react';

export default function H2({children, className} : {children: ReactNode, className?: string}) {
  return (
    <h2 className={"up-h2 " + (className || "")}>
        {children}
    </h2>
  );
}