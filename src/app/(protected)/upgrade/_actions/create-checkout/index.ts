"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createCheckout = async () => {
  const { userId } = await auth();
  console.log("User ID:", userId);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  // Cria um customer com o clerk_user_id no metadata
  const customer = await stripe.customers.create({
    metadata: {
      clerk_user_id: userId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: process.env.NEXT_PUBLIC_APP_URL,
    cancel_url: process.env.NEXT_PUBLIC_APP_URL,
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { sessionId: session.id };
};
