"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import axios from "axios";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    axios
      .get(`/api/checkout_sessions?session_id=${sessionId}`)
      .then((response) => {
        const data = response.data;
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      })
      .catch((error) => {
        console.error("Error fetching checkout session data:", error);
      });
  }, []);

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <main className="flex min-h-screen flex-col items-start justify-start container">
        <div className="mt-5">
          <div>
            <h3>Payment Successful</h3>
            <p>
              We appreciate your business! A confirmation email will be sent to{" "}
              {customerEmail}. If you have any questions, please email{" "}
              <a href="mailto:orders@example.com">orders@example.com</a>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
