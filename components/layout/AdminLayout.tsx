"use client"
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={open} toggle={()=>setOpen(false)}  />
      <div className="flex flex-col flex-1 w-full">
        <Header open={open} toggle={()=>setOpen(true)} />
        <main className="flex-1 relative overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
