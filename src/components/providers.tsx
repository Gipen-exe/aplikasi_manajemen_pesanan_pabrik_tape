"use client"

import { FinanceProvider } from "@/hooks/use-finance"
import { OrdersProvider } from "@/hooks/use-orders"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrdersProvider>
      <FinanceProvider>
        {children}
        <Toaster position="top-center" richColors />
      </FinanceProvider>
    </OrdersProvider>
  )
}
