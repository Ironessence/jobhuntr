"use client";
import coin from "@/assets/icons/icon-coin.png";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";

const TokensDisplay = () => {
  const { user } = useUserContext();
  return (
    <div className="flex items-center gap-1 bg-blue-900 py-1 px-2 rounded-lg">
      <Image
        src={coin}
        alt="token"
        width={20}
        height={20}
      />
      <p className="text-white font-bold">{user?.tokens || 0}</p>
    </div>
  );
};

export default TokensDisplay;
