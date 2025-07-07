export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-secondary h-full w-full p-4 sm:p-8">{children}</div>
  );
};
