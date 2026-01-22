"use client"

import { ButtonProps } from "@/types/common";

export default function Button(props: ButtonProps) {
  const {
    title,
    type = "button",
    style,
    className = "bg-background",
    leftIcon,
    disabled = false,
    onClick,
  } = props;
  return <button
  type={type}
  onClick={onClick}
  disabled={disabled}
  className={`${className} gap-2 cursor-pointer shadow-[inset_0_-1px_5px_rgba(0,0,0,0.2)] rounded-sm border p-2.5`}
  style={style}
  >
    {leftIcon && leftIcon}
    {title && title}
  </button>;
}
