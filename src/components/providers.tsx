"use client"

import { ThemeProvider } from "next-themes"
import { OrdersProvider } from "@/hooks/use-orders"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <OrdersProvider>
        {children}
        <Toaster position="top-center" richColors />
      </OrdersProvider>
    </ThemeProvider>
  )
}
