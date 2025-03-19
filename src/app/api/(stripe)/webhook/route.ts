import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Handle token purchase
      if (session.mode === "payment" && session.metadata?.userId && session.metadata?.tokenAmount) {
        const userId = session.metadata.userId;
        const tokenAmount = parseInt(session.metadata.tokenAmount);
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
        );
        const amount = paymentIntent.amount / 100; // Convert from cents to dollars

        // Update user with tokens and payment history
        await User.findByIdAndUpdate(userId, {
          $inc: { tokens: tokenAmount },
          $push: {
            paymentHistory: {
              amount: amount,
              tokens: tokenAmount,
              date: new Date(),
              stripePaymentId: session.payment_intent,
            },
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
