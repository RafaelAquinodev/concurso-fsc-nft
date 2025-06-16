import { PageContainer } from "../_components/page-container";
import NftCard from "./_components/nftCard";

const nftsPage = () => {
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
