"use client";

import coins1 from "@/assets/images/coins1.png";
import coins2 from "@/assets/images/coins2.png";
import coins3 from "@/assets/images/coins3.png";
import TokenCard from "@/components/shared/TokenCard";
import { constants } from "@/constants";

const BuyTokens = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Purchase Tokens</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <TokenCard
          tokens={1000}
          price={10}
          priceId={constants.STRIPE.PRICES.TOKENS_1000}
          img={coins1}
        />
        <TokenCard
          tokens={2300}
          price={20}
          bonus={300}
          priceId={constants.STRIPE.PRICES.TOKENS_2300}
          img={coins2}
        />
        <TokenCard
          tokens={3800}
          price={30}
          bonus={800}
          priceId={constants.STRIPE.PRICES.TOKENS_3800}
          img={coins3}
        />
      </div>
    </div>
  );
};

export default BuyTokens;
