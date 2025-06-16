import { PageContainer } from "../_components/page-container";
import NftCard from "./_components/nft-card";

const NftsPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-wrap gap-8">
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
      </div>
    </PageContainer>
  );
};
export default NftsPage;
