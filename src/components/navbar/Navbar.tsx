'use client'
import { constants } from "@/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginButton from "../shared/LoginButton";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "../ui/button";


 const Navbar = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

  

    return (
       <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{constants.APP_TITLE}</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
            {session?.user ? <Button onClick={() => router.push('/dashboard')}>Dashboard</Button> : <LoginButton />}
          </div>
        </nav>
      </header>
    )
}

export default Navbar;