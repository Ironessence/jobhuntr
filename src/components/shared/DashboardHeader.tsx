import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import NavUser from "./NavUser";
import TokensDisplay from "./TokensDisplay";

const DashboardHeader = () => {
  const { user } = useUserContext();
  const router = useRouter();
  return (
    <header className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-12">
        <h1
          className="md:text-2xl text-lg font-bold cursor-pointer font-archivo"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </h1>
        <div className="relative">
          <span className="md:text-2xl text-lg font-bold cursor-not-allowed text-muted-foreground/60 font-archivo">
            Leaderboard
          </span>
          <Badge
            variant="outline"
            className="absolute -top-3 -right-16 bg-amber-500/20 text-amber-500 border-amber-500/50 text-[10px]"
          >
            Coming Soon
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <TokensDisplay />
        {user && <NavUser />}
      </div>
    </header>
  );
};

export default DashboardHeader;
