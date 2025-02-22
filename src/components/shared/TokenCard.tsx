import { useUserContext } from "@/context/AuthContext";

import { loadStripe } from "@stripe/stripe-js";
import Image, { StaticImageData } from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";

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

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        toast(result.error.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
            className="object-contain w-[70%]"
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

export default TokenCard;
