"use client";

import { UserProvider } from "@/context/user-context";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme-context";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Theme>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Theme>

      <Toaster richColors />
    </>
  );
}
