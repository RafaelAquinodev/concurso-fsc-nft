"use server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createCheckout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  // ✅ Cria um customer com o clerk_user_id no metadata
  const customer = await stripe.customers.create({
    metadata: {
      clerk_user_id: userId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer: customer.id,
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        clerk_user_id: userId, // aqui, exatamente onde você vai precisar no webhook
      },
    },
  });

  return { sessionId: session.id };
};
