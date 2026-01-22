import NavLink from "./NavLink";

export type LinkItem = {
  name:string,
  href:string
}

export default function Sidebar() {
  const navLinks:LinkItem[] = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Content",
      href: "/content",
    },
  ];
  return (
    <aside className="w-64 hidden lg:block bg-gray-100 border-r border-r-gray-300 ">
      <div className="px-4 py-3 font-light text-lg text-gray-500">
        [QR] <span className="font-bold text-foreground"> Admin</span>
      </div>

      <div className="bg-gray-300 h-px" />

      <nav className="px-4 space-y-2 pt-2">
        {navLinks.map((item, index) => (
          <NavLink key={index} name={item.name} href={item.href}/>
        ))}
      </nav>
    </aside>
  );
}
