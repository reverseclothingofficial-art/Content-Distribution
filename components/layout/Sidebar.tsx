import NavLink from "./NavLink";

export type LinkItem = {
  name:string,
  href:string
}

export default function Sidebar({open,toggle}:{open:boolean,toggle:()=>void}) {
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
    <aside className={`w-64 ${!open && "hidden" } absolute h-full z-100 lg:static lg:block bg-gray-100 border-r border-r-gray-300`}>
      <div className="px-4 py-3 font-light text-lg text-gray-500 flex items-center justify-between">
        <span className="font-bold text-foreground"> CD Admin</span>
        <button className="lg:hidden" onClick={()=>toggle()}>
          close
        </button>
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
