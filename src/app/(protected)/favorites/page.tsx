import { currentUser } from "@clerk/nextjs/server";
import { PageContainer } from "../_components/page-container";
import FavoriteNftCards from "./_components/favorite-cards";
import { redirect } from "next/navigation";

const FavoritesPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }
  const isPremium = user.publicMetadata?.subscriptionPlan === "premium";

  if (!isPremium) {
    return redirect("/upgrade");
  }

  return (
    <PageContainer>
      <div className="flex flex-wrap gap-8">
        <FavoriteNftCards />
      </div>
    </PageContainer>
  );
};
export default FavoritesPage;
