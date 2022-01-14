import React, {ReactNode} from 'react';

export default function Badge({children, className, dark} : {children: ReactNode, className?: string, dark?: boolean}) {
  return (
      <div
          className={`${dark ? "bg-gray-500 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-500"} border rounded-md text-xs inline-block ${className || ""}`}
          style={{padding: "2px 4px"}}
      >
        {children}
    </div>
  );
}