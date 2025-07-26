"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Plus,
  Home,
  Search,
  Menu,
  Wallet,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Add Expense", href: "/add", icon: Plus },
  { name: "Browse", href: "/browse", icon: Search },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userSession");
    window.location.href = "/login";
  };

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Expense Tracker</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavItems />
            </div>

            {/* Logout - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>

              <Link
                href="/profile"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <UserIcon className="h-4 w-4" />
                Leaderboard
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <UserIcon className="h-4 w-4" />
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Mobile Nav Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-6">
                  <NavItems />

                  {/* Profile - Mobile */}
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>

                  {/* Logout - Mobile */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
