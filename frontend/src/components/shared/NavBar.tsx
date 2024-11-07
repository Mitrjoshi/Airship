import { BellIcon, RocketIcon } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="p-4 h-14 border-b flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <RocketIcon />
        <h1 className="text-2xl font-semibold">Airship</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="size-8 border rounded-full flex items-center justify-center">
          <BellIcon size={20} strokeWidth={1.5} />
        </div>
        <div className="size-8 bg-gradient-to-br from-emerald-400 to-amber-300 rounded-full" />
      </div>
    </nav>
  );
}
