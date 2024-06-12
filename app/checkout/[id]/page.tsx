"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/UserContext";

let stripePromise: any;
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export default function CheckOutPage() {
  const { user } = useAuth();
  const { id: eventId } = useParams();
  const searchParams = useSearchParams();
  const price = searchParams.get("price");
  const name = searchParams.get("name");

  console.log(eventId);

  const fetchClientSecret = useCallback(async () => {
    const eventData = {
      eventId: eventId,
      eventName: name,
      eventPrice: price,
      userEmail: user?.email,
      userId: user?.id,
    };

    try {
      const response = await axios.post("/api/checkout_sessions", eventData);
      console.log(response, "RES");

      return response.data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  }, [name, price, user, eventId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
