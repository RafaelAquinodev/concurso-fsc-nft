"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./react-query";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
