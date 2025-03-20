"use client";

import { CreditCard, File, LogOut, Sparkles } from "lucide-react";

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
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/buy-tokens")}>
            <Sparkles className="w-4 h-4 mr-2" />
            Buy Tokens
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/payment-history")}>
            <CreditCard className="w-4 h-4 mr-2" />
            Payment History
          </DropdownMenuItem>
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
