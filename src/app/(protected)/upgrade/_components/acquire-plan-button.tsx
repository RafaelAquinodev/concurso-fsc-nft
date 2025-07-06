"use client";

import { useUser } from "@clerk/nextjs";
import { createCheckout } from "../_actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";

const AcquirePlanButton = () => {
  const handleAcquirePlanClick = async () => {
    try {
      const { sessionId } = await createCheckout();

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Stripe not found");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erro no checkout:", error);
    }
  };

  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  return (
    <button
      onClick={handleAcquirePlanClick}
      disabled={premiumPlan}
      className="gradient-brand w-full cursor-pointer rounded-xl px-8 py-3 text-white shadow-lg transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,0,204,0.6)] disabled:cursor-default disabled:opacity-50 disabled:hover:shadow-none"
    >
      Seja Premium
    </button>
  );
};

export default AcquirePlanButton;
