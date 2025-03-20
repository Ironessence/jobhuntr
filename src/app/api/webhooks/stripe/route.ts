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

    // Handle successful checkout completion
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
        await User.findByIdAndUpdate(
          userId,
          {
            $inc: { tokens: tokenAmount },
            $push: {
              paymentHistory: {
                amount: amount,
                tokens: tokenAmount,
                date: new Date(),
                stripePaymentId: session.payment_intent,
                status: "completed",
              },
            },
          },
          { new: true },
        );
      }
    }

    // Handle payment failure events
    else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // The problem: paymentIntent.metadata might not have userId
      // We need to find the checkout session that created this payment intent
      try {
        // Find the checkout session associated with this payment intent
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          expand: ["data.customer"],
        });

        if (sessions.data.length > 0) {
          const session = sessions.data[0];

          // Get userId from session metadata
          const userId = session.metadata?.userId;

          if (userId) {
            const amount = paymentIntent.amount / 100;
            const errorMessage = paymentIntent.last_payment_error?.message || "Unknown error";

            // Record the failed payment
            await User.findByIdAndUpdate(userId, {
              $push: {
                paymentHistory: {
                  amount: amount,
                  tokens: 0,
                  date: new Date(),
                  stripePaymentId: paymentIntent.id,
                  status: "failed",
                  errorMessage: errorMessage,
                },
              },
            });
          } else if (session.customer) {
            // If we don't have userId in metadata, try to find user by Stripe customer ID
            const customerId =
              typeof session.customer === "string" ? session.customer : session.customer.id;

            const user = await User.findOne({ stripeCustomerId: customerId });

            if (user) {
              const amount = paymentIntent.amount / 100;
              const errorMessage = paymentIntent.last_payment_error?.message || "Unknown error";

              await User.findByIdAndUpdate(user._id, {
                $push: {
                  paymentHistory: {
                    amount: amount,
                    tokens: 0,
                    date: new Date(),
                    stripePaymentId: paymentIntent.id,
                    status: "failed",
                    errorMessage: errorMessage,
                  },
                },
              });
            }
          }
        }
      } catch (error) {
        console.error("Error processing failed payment:", error);
      }
    }

    // Handle other payment-related events if needed
    else if (event.type === "charge.failed") {
      const charge = event.data.object as Stripe.Charge;
      console.log("Charge failed:", charge.id);
      // Handle failed charge
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      console.log("Charge refunded:", charge.id);
      // Handle refund (you might want to deduct tokens)
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
