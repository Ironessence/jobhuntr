"use client";
import icon from "@/assets/icons/icon-applyninja.png";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginButton from "../shared/LoginButton";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "../ui/button";
import NavbarSkeleton from "./NavbarSkeleton";

const Navbar = ({
  setIsLoginDialogOpen,
  isLoginDialogOpen,
}: {
  setIsLoginDialogOpen: (open: boolean) => void;
  isLoginDialogOpen: boolean;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  if (status === "loading") {
    return <NavbarSkeleton />;
  }

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Image
            src={icon}
            alt="applyninja-icon"
            width={30}
            height={30}
            priority
          />
          <h1
            className={`sm:text-2xl text-xl font-bold font-archivo tracking-wide ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            ApplyNinja.ai
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
          ) : (
            <LoginButton
              setIsLoginDialogOpen={setIsLoginDialogOpen}
              isLoginDialogOpen={isLoginDialogOpen}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
