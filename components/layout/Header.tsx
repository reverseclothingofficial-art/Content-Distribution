export default function Header({open,toggle}:{open:boolean,toggle:()=>void}) {
  return (
    <header className=" bg-white flex items-center py-2.5 px-6">
      <button 
      onClick={()=>toggle()}
      className="border p-2 border-gray-400 lg:hidden">
        Menu
      </button>
      <div className="ml-auto flex justify-center items-center rounded-full border border-gray-400 h-8 w-8 text-sm text-gray-400 font-bold">
        A
      </div>
    </header>
  );
}
