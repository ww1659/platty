// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import stripe from "@/config/stripe";
import StripeTypes from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supaAddUserEvent } from "@/lib/queries";

export async function POST(req: NextRequest, res: NextResponse) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;
  const sig = req.headers.get("stripe-signature");

  let event;
  const data = await req.text();

  if (sig && data && endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
    } catch (err) {
      const error = err as StripeTypes.errors.StripeError;
      console.error("Error verifying webhook signature:", error.message);
      return NextResponse.json(
        { "Webhook Error": error.message },
        { status: 400 }
      );
    }
  }

  // Handle specific event types
  if (event) {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        const eventId = paymentIntent.metadata.eventId;
        await supaAddUserEvent(eventId, userId);
        console.log(
          "Payment succeeded and event added to your events",
          paymentIntent
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  return NextResponse.json({ status: 200 });
}
