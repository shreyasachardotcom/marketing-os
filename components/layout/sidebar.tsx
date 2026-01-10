"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Home,
  Kanban,
  Calendar,
  FileText,
  StickyNote,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Kanban },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Requisitions", href: "/dashboard/requisitions", icon: FileText },
  { name: "Team Notes", href: "/dashboard/notes", icon: StickyNote },
  { name: "Team", href: "/dashboard/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-h3">Marketing OS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-light-gray text-black"
                  : "text-dark-gray hover:bg-light-gray hover:text-black"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Admin link - only visible to admins */}
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard/admin"
                ? "bg-light-gray text-black"
                : "text-dark-gray hover:bg-light-gray hover:text-black"
            )}
          >
            <Settings className="h-5 w-5" />
            Admin
          </Link>
        )}
      </nav>

      {/* User info and logout */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-10 w-10 rounded-full"
            />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-dark-gray">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
