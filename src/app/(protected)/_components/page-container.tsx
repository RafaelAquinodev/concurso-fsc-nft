export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-secondary h-full w-full p-4 sm:px-8 sm:py-4">
      {children}
    </div>
  );
};
