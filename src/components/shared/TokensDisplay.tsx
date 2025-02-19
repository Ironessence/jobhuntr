"use client";
import token from "@/assets/icons/icon-shuriken.png";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";

const TokensDisplay = () => {
  const { user } = useUserContext();
  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-800 py-1 px-2 rounded-lg">
      <Image
        src={token}
        alt="token"
        width={16}
        height={16}
      />
      <p className="text-white font-bold">{user?.tokens || 0}</p>
    </div>
  );
};

export default TokensDisplay;
