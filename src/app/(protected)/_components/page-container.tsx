"use client";

import { useEffect, useState } from "react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`bg-secondary h-full w-full p-4 transition-opacity duration-700 ease-in-out sm:px-8 sm:py-4 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};
