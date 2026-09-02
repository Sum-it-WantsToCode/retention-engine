import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
        <span className="text-blue-600">❖</span> ClearSpace
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden md:block font-medium">
          Admin
        </span>
        <UserButton />
      </div>
    </nav>
  );
}