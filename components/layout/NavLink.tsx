"use client";

import Link from "next/link";
import { LinkItem } from "./Sidebar";
import { usePathname } from "next/navigation";

export default function NavLink({href,name}:LinkItem) {
    const pathname = usePathname();
    const isActive = `/${pathname.split("/")[1] }`=== href;
  return (
    <Link
      href={href}
      className={`block text-sm px-3 py-2 rounded transition-all ease-in-out duration-200 hover:bg-foreground hover:text-background ${
        isActive ? "bg-foreground text-background" : "bg-background text-foreground"
      }`}
    >
      {name}
    </Link>
  );
}
