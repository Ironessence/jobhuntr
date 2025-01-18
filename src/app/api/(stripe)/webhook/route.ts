import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for raw payload
  },
};

export async function POST(req: Request) {
  const rawBody = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    // Verify the Stripe webhook signature
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody), // Convert ArrayBuffer to Buffer
      sig!,
      endpointSecret!,
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectToDatabase();

      // Get the line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      if (!priceId) {
        throw new Error("No price ID found in session");
      }

      // Get the user email from session metadata instead of customer details
      const userEmail = session.metadata?.userEmail;

      if (!userEmail) {
        throw new Error("No user email found in session metadata");
      }

      // Get token amount based on price ID
      const tokenAmount =
        constants.STRIPE.PRICE_TO_TOKENS[priceId as keyof typeof constants.STRIPE.PRICE_TO_TOKENS];

      console.log("~~~~TOKEN AMOUNT:", tokenAmount);

      if (!tokenAmount) {
        throw new Error("Invalid price ID");
      }

      // Update user's token balance using the correct email
      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $inc: { tokens: tokenAmount } },
        { new: true },
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      console.log(`Updated tokens for user ${userEmail}: +${tokenAmount} tokens`);
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json({ error: "Error processing payment completion" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
