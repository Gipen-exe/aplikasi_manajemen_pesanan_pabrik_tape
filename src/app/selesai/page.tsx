"use client"

import { EmptyState } from "@/components/empty-state"
import { LoadingScreen } from "@/components/loading-screen"
import { OrderCard } from "@/components/orders/order-card"
import { useOrders } from "@/hooks/use-orders"

export default function DonePage() {
  const { ready, archivedOrders } = useOrders()

  if (!ready) return <LoadingScreen />

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl">Yang sudah selesai</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Riwayat pesanan yang sudah diambil atau dibatalkan.
        </p>
      </div>

      {archivedOrders.length === 0 ? (
        <EmptyState
          title="Belum ada yang selesai"
          description="Kalau pesanan sudah diambil pelanggan, tandai selesai dari antrian. Nanti muncul di sini."
        />
      ) : (
        <div className="space-y-3">
          {archivedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
