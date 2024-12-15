import { useUserContext } from "@/context/AuthContext";
import { NavUser } from "./NavUser";

const DashboardHeader = ({
  setIsResumeDialogOpen,
}: {
  setIsResumeDialogOpen: (open: boolean) => void;
}) => {
  const { user } = useUserContext();
  return (
    <header className="flex justify-between items-center mb-5">
      <h1 className="md:text-2xl text-lg font-bold ">Dashboard</h1>
      {user && (
        <NavUser
          user={user}
          setIsResumeDialogOpen={setIsResumeDialogOpen}
        />
      )}
    </header>
  );
};

export default DashboardHeader;
