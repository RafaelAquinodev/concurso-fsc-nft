import { PageContainer } from "../_components/page-container";
import UpgradePlan from "./_components/upgrade-card";

const NftsPage = () => {
  return (
    <PageContainer>
      <div className="mx-auto flex h-[400px] w-[800px] flex-wrap gap-8 pt-8">
        <UpgradePlan />
      </div>
    </PageContainer>
  );
};
export default NftsPage;
