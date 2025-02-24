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

  const session = event.data.object as any; // Using any since different events have different shapes

  await connectToDatabase();

  switch (event.type) {
    case "customer.subscription.created":
      // Initial subscription - add tokens
      const user = await User.findOne({ stripeCustomerId: session.customer });
      if (!user) break;

      const foundTier = Object.entries(constants.SUBSCRIPTION.TIERS as SubscriptionTiers).find(
        ([_, tierData]: [string, SubscriptionTier]) =>
          "priceId" in tierData && tierData.priceId === session.items.data[0].price.id,
      )?.[0];

      if (foundTier && isValidTier(foundTier)) {
        const tierData = constants.SUBSCRIPTION.TIERS[foundTier] as SubscriptionTier;
        await User.findByIdAndUpdate(user._id, {
          tier: foundTier,
          stripeSubscriptionId: session.id,
          currentPeriodEnd: new Date(session.current_period_end * 1000),
          cancelAtPeriodEnd: false,
          $unset: { cancellingSubscriptionId: "" },
          $inc: { tokens: tierData.monthlyTokens },
        });
      }
      break;

    case "invoice.payment_succeeded":
      // Monthly renewal - add new tokens
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const renewalUser = await User.findOne({ stripeCustomerId: session.customer });

      if (renewalUser && subscription.status === "active") {
        // We should only add tokens if this is a renewal, not the initial payment
        const isInitialPayment = subscription.current_period_start === subscription.start_date;

        if (!isInitialPayment) {
          const renewalTier = Object.entries(
            constants.SUBSCRIPTION.TIERS as SubscriptionTiers,
          ).find(
            ([_, tierData]) =>
              "priceId" in tierData && tierData.priceId === subscription.items.data[0].price.id,
          )?.[0];

          if (renewalTier && isValidTier(renewalTier)) {
            const tierData = constants.SUBSCRIPTION.TIERS[renewalTier] as SubscriptionTier;
            await User.findByIdAndUpdate(renewalUser._id, {
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              $inc: { tokens: tierData.monthlyTokens },
            });
          }
        }
      }
      break;

    case "invoice.payment_failed":
      // Payment failed - notify user
      const failedUser = await User.findOne({ stripeCustomerId: session.customer });
      if (failedUser?.email) {
        // TODO Here you would typically integrate with your email service
        console.log(`Payment failed for user ${failedUser.email}`);
        // The user will also get Stripe's automatic email about the failed payment
      }
      break;

    case "customer.subscription.updated":
      // Track when subscription is marked for cancellation
      const updatedSubscription = event.data.object as Stripe.Subscription;
      if (updatedSubscription.cancel_at_period_end) {
        await User.findOneAndUpdate(
          { stripeSubscriptionId: updatedSubscription.id },
          {
            cancelAtPeriodEnd: true,
            cancellingSubscriptionId: updatedSubscription.id,
          },
        );
      }
      break;

    case "customer.subscription.deleted":
      // This happens after the period ends for a cancelled subscription
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
