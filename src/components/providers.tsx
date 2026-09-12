"use client"

import { OrdersProvider } from "@/hooks/use-orders"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrdersProvider>
      {children}
      <Toaster position="top-center" richColors />
    </OrdersProvider>
  )
}
