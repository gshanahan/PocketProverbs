import { Stripe } from "https://js.stripe.com/v3/";

// Your publishable key from Stripe
const stripe = Stripe("pk_test_51R9HekP2ektVprqC9xbpfPv6i3wvFKJiOb0KiCiTpFvQnhERq3SVsYGGVCZjHDyRW54AHtUq2pnpMyknSC8rK6J400WDwL6pJn");

  // Handle the Donation Button Click
  document.getElementById("donateButton").addEventListener("click", async () => {
    // Create a Stripe Checkout session
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 499, // Amount in cents for $4.99
        type: "donate"
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Error:", error);
    }
  });

  // Handle the Subscription Button Click
  document.getElementById("subscribeButton").addEventListener("click", async () => {
    // Create a Stripe Checkout session
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 499, // Amount in cents for $4.99
        type: "subscribe"
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Error:", error);
    }
  });

<script src="https://js.stripe.com/v3/"></script>

