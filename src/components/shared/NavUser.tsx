"use client";

import { File, LogOut, Settings, Sparkles } from "lucide-react";

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
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "../ui/switch";

export function NavUser({
  setIsResumeDialogOpen,
}: {
  setIsResumeDialogOpen: (open: boolean) => void;
}) {
  const { user } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Get tier display info
  const tierInfo = user?.tier ? constants.SUBSCRIPTION.TIERS[user.tier] : null;

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case "FREE":
        return "from-blue-400 to-blue-500";
      case "APPRENTICE":
        return "from-blue-500 to-purple-500";
      case "NINJA":
        return "from-purple-500 to-purple-600";
      default:
        return "from-blue-400 to-blue-500";
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 items-center justify-centerdata-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.image}
              alt={user.name}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
          </div>
          <CaretSortIcon className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.image}
                alt={user.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
              {tierInfo && (
                <div className="flex">
                  <div
                    className={`
                      inline-flex items-center gap-1 px-2.5 py-0.5 mt-1
                      text-xs font-medium text-white rounded-full
                      w-fit bg-gradient-to-r ${getTierGradient(user?.tier)}
                    `}
                  >
                    <Sparkles className="w-3 h-3" />
                    {tierInfo.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
        >
          <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/upgrade")}>
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade Plan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => {
              setIsResumeDialogOpen(true);
              setIsDialogOpen(false);
            }}
          >
            <File className="w-5 h-5" />
            Resume
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

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
