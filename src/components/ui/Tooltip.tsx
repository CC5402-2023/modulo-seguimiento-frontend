import { ReactNode } from "react"
import clsx from "clsx";
import React from "react";

interface TooltipProps
  extends React.BaseHTMLAttributes<HTMLBodyElement> {
  message: string;
  children: ReactNode;
}

export default function Tooltip(tooltipProps: TooltipProps) {
  return (
  <div className={clsx(
    "group relative flex",
    tooltipProps.className,
  )}>
      {tooltipProps.children}
      <span className="absolute top-10 z-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {tooltipProps.message}
      </span>
  </div>
  )
}
