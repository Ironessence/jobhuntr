import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { SubscriptionTier, SubscriptionTiers, isValidTier } from "@/types/Subscription.types";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Subscription;

  await connectToDatabase();

  switch (event.type) {
    case "customer.subscription.created":
      // Only add tokens on initial subscription creation
      const user = await User.findOne({ stripeCustomerId: session.customer });
      if (!user) break;

      console.log("Webhook - User current state:", {
        currentTier: user.tier,
        currentTokens: user.tokens,
        currentPeriodEnd: user.currentPeriodEnd,
      });

      const foundTier = Object.entries(constants.SUBSCRIPTION.TIERS as SubscriptionTiers).find(
        ([_, tierData]: [string, SubscriptionTier]) =>
          "priceId" in tierData && tierData.priceId === session.items.data[0].price.id,
      )?.[0];

      if (foundTier && isValidTier(foundTier)) {
        const tierData = constants.SUBSCRIPTION.TIERS[foundTier] as SubscriptionTier;
        const tokenAdjustment = tierData.monthlyTokens;

        await User.findByIdAndUpdate(user._id, {
          tier: foundTier,
          stripeSubscriptionId: session.id,
          currentPeriodEnd: new Date(session.current_period_end * 1000),
          $inc: { tokens: tokenAdjustment },
        });

        console.log("Webhook - Final adjustment:", {
          tokenAdjustment,
          newTotalTokens: user.tokens + tokenAdjustment,
        });
      }
      break;

    case "customer.subscription.updated":
      // Only update tier and period end, no token adjustments
      const updatedUser = await User.findOne({ stripeCustomerId: session.customer });
      if (!updatedUser) break;

      const updatedTier = Object.entries(constants.SUBSCRIPTION.TIERS as SubscriptionTiers).find(
        ([_, tierData]: [string, SubscriptionTier]) =>
          "priceId" in tierData && tierData.priceId === session.items.data[0].price.id,
      )?.[0];

      if (updatedTier && isValidTier(updatedTier)) {
        await User.findByIdAndUpdate(updatedUser._id, {
          tier: updatedTier,
          currentPeriodEnd: new Date(session.current_period_end * 1000),
        });
      }
      break;

    case "customer.subscription.deleted":
      // Let them keep their tokens when cancelling
      await User.findOneAndUpdate(
        { stripeSubscriptionId: session.id },
        {
          tier: "FREE",
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        },
      );
      break;
  }

  return NextResponse.json({ received: true });
}
