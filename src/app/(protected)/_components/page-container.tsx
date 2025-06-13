export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-secondary h-full w-full space-y-6 p-6">{children}</div>
  );
};
