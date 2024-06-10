import { NextRequest, NextResponse } from "next/server";
import stripe from "@/config/stripe";
import StripeTypes from "stripe";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const sessionId = searchParams.get("session_id");

  try {
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return NextResponse.json({
        status: session.status,
        customer_email: session.customer_details?.email,
      });
    }
  } catch (err) {
    const error = err as StripeTypes.errors.StripeError;
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer_email: data.userEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: data.eventName,
            },
            unit_amount: data.eventPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: data.userId,
        eventId: data.eventId,
      },
      return_url: `${req.headers.get(
        "origin"
      )}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    const error = err as StripeTypes.errors.StripeError;
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
