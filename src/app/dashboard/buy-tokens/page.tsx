"use client";

import coins1 from "@/assets/images/coins1.png";
import coins2 from "@/assets/images/coins2.png";
import coins3 from "@/assets/images/coins3.png";
import { Button } from "@/components/ui/button";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import Image, { StaticImageData } from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const TokenCard = ({
  tokens,
  price,
  bonus,
  priceId,
  img,
}: {
  tokens: number;
  price: number;
  bonus?: number;
  priceId: string;
  img: StaticImageData;
}) => {
  const { toast } = useToast();
  const { user } = useUserContext();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();

      if (!data.sessionId) {
        throw new Error("No session ID received from server");
      }

      console.log("Session ID received:", data.sessionId); // Debug log

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error); // Debug log
        toast({
          title: "Error",
          description: result.error.message || "Payment failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative group max-w-[400px] mx-auto">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-background/80 backdrop-blur-xl border rounded-lg p-6 h-full flex flex-col justify-between transition-all duration-200 hover:scale-105">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-2">{tokens.toLocaleString()} Tokens</h3>
          {bonus && (
            <p className="text-emerald-500 font-semibold">
              +{bonus.toLocaleString()} Bonus Tokens!
            </p>
          )}
          <p className="text-muted-foreground mt-4">
            Access our AI-powered features and enhance your job search
          </p>
        </div>
        <div className="flex items-center justify-center mt-5">
          <Image
            src={img}
            alt="Coins"
            className="object-contain"
          />
        </div>
        <div className="mt-6 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold mb-4">${price}</p>
          <Button
            className="w-full text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            onClick={handleCheckout}
          >
            Purchase Now
          </Button>
        </div>
      </div>
    </div>
  );
};

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
