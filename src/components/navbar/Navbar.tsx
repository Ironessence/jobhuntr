"use client";
import blackLogo from "@/assets/logos/apply.ninja black.png";
import whiteLogo from "@/assets/logos/apply.ninja white.png";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginButton from "../shared/LoginButton";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "../ui/button";
import NavbarSkeleton from "./NavbarSkeleton";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  if (status === "loading") {
    return <NavbarSkeleton />;
  }

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Image
          src={theme === "dark" ? whiteLogo : blackLogo}
          alt="Apply.ninja"
          className="md:w-[400px] md:h-[70px] w-[200px] h-[40px] object-contain"
        />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
