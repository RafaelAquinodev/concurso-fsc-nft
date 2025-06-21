import { PageContainer } from "../_components/page-container";
import WalletTransfersClient from "./_components/transfers-table";


const TransactionPage = () => {
  return (
    <PageContainer>
      <WalletTransfersClient />
    </PageContainer>
  );
};

export default TransactionPage;
