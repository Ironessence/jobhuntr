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
      </div>
      <div className="flex items-center gap-5">
        <TokensDisplay />
        {user && <NavUser />}
      </div>
    </header>
  );
};

export default DashboardHeader;
