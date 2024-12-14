"use client"

import {
  BadgeCheck,
  DollarSign,
  LogOut,
  Sparkles
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"
import { useState } from "react"

export function NavUser({
  user,
  setIsResumeDialogOpen,
}: {
  user: {
    name: string
    email: string
    image: string
  }
  setIsResumeDialogOpen: (open: boolean) => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  return (
    
        <DropdownMenu open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenuTrigger asChild>
            <div
            
              className="flex gap-2 items-center justify-centerdata-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image} alt={user.name} />
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
            side='bottom'
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem className="flex items-center gap-2" onClick={() => {
                setIsResumeDialogOpen(true)
                setIsDialogOpen(false)
               } }>
                <DollarSign className="w-5 h-5" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => signOut()}>
              <LogOut className="w-5 h-5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
     
  )
}
