"use client";
import { useUser } from "@clerk/nextjs";
import { createCheckout } from "../_actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";
const AcquirePlanButton = () => {
  const handleAcquirePlanClick = async () => {
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
  };
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  return (
    <button
      onClick={handleAcquirePlanClick}
      disabled={premiumPlan}
      className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Comprar
    </button>
  );
};
export default AcquirePlanButton;
