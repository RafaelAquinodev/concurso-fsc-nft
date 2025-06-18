import { PageContainer } from "../_components/page-container";
import NftCards from "./_components/nft-cards";

const NftsPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-wrap gap-8">
        <NftCards />
      </div>
    </PageContainer>
  );
};
export default NftsPage;
