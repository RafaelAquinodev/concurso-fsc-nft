import { PageContainer } from "../_components/page-container";
import FavoriteNftCards from "./_components/favorite-cards";

const FavoritesPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-wrap gap-8">
        <FavoriteNftCards />
      </div>
    </PageContainer>
  );
};
export default FavoritesPage;
