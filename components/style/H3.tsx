import {ReactNode} from 'react';

export default function H3({children, className} : {children: ReactNode, className?: string}) {
  return (
    <h3 className={"font-medium text-gray-500 " + (className || "")}>
        {children}
    </h3>
  );
}