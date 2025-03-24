"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentLevelProgress } from "@/constants/challenges";
import { useUserContext } from "@/context/AuthContext";
import { File, History, LogOut, Moon, Sparkles, Sun, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import UserLevelDisplay from "../navbar/UserLevelDisplay";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

export default function NavUser() {
  const { user } = useUserContext();
  const { badge } = getCurrentLevelProgress(user?.experience || 0);
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const handleThemeToggle = (e: React.MouseEvent, checked: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-input bg-background p-1 text-sm font-normal">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || ""}
              alt={user.name}
            />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="mr-2">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* User level display */}
        <div className="px-2">
          <UserLevelDisplay
            user={user}
            compact
          />
          <div className="flex justify-center mb-2">
            <Badge className="bg-gradient-to-br from-blue-400 to-blue-700 text-white font-bold py-1 px-2 rounded-full">
              {badge.name}
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>Dark Mode</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  handleThemeToggle(event as unknown as React.MouseEvent, checked)
                }
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/buy-tokens"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Buy Tokens
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/payment-history"
              className="flex items-center gap-2"
            >
              <History className="w-5 h-5" />
              Payment History
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/resume"
              className="flex items-center gap-2"
            >
              <File className="w-5 h-5" />
              Resume
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
