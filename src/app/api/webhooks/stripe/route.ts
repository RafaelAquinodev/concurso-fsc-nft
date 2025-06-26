import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing Stripe env vars");
      return NextResponse.error();
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.error();
    }

    const text = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-10-28.acacia",
    });

    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Evento recebido do Stripe:", JSON.stringify(event, null, 2));
    console.log(
      "Objeto do evento:",
      JSON.stringify(event.data.object, null, 2),
    );

    const clerk = await clerkClient();

    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId = (invoice as any).parent?.subscription_details
          ?.subscription;
        const customer = invoice.customer as string;

        console.log(
          "[invoice.payment_succeeded] Subscription ID:",
          subscriptionId,
        );
        console.log("[invoice.payment_succeeded] Customer ID:", customer);

        if (!subscriptionId) {
          console.error("Missing subscription ID");
          return NextResponse.error();
        }

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const clerkUserId = subscription.metadata?.clerk_user_id;

        console.log("[invoice.payment_succeeded] Clerk User ID:", clerkUserId);

        if (!clerkUserId) {
          console.error("Missing clerk_user_id in subscription metadata");
          return NextResponse.error();
        }

        await clerk.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: customer,
            stripeSubscriptionId: subscriptionId,
          },
          publicMetadata: {
            subscriptionPlan: "premium",
          },
        });

        console.log("[invoice.payment_succeeded] User updated successfully.");
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        const clerkUserId = subscription.metadata?.clerk_user_id;

        console.log(
          "[customer.subscription.deleted] Clerk User ID:",
          clerkUserId,
        );

        if (!clerkUserId) {
          console.error("Missing clerk_user_id on subscription deletion");
          return NextResponse.error();
        }

        await clerk.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          },
          publicMetadata: {
            subscriptionPlan: null,
          },
        });

        console.log(
          "[customer.subscription.deleted] User subscription removed.",
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
};
