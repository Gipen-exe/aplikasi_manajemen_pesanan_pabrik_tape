"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PlusIcon, SearchIcon } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { LoadingScreen } from "@/components/loading-screen"
import { OrderCard } from "@/components/orders/order-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useOrders } from "@/hooks/use-orders"
import { STATUS_META } from "@/lib/constants"
import type { OrderStatus } from "@/lib/types"

const FILTERS: Array<{ id: "all" | OrderStatus; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "baru", label: STATUS_META.baru.short },
  { id: "diproses", label: STATUS_META.diproses.short },
  { id: "siap", label: STATUS_META.siap.short },
]

export default function OrdersPage() {
  const { ready, activeOrders, setStatus } = useOrders()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all")

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activeOrders.filter((order) => {
      if (filter !== "all" && order.status !== filter) return false
      if (!q) return true
      return (
        order.customerName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.productLabel.toLowerCase().includes(q) ||
        order.notes.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q)
      )
    })
  }, [activeOrders, filter, query])

  if (!ready) return <LoadingScreen />

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl">Semua pesanan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cari nama, nomor, atau catatan. Urutannya tetap dari yang paling perlu didahulukan.
        </p>
      </div>

      <Button
        className="h-12 w-full rounded-2xl text-base"
        nativeButton={false}
        render={<Link href="/pesanan/baru" />}
      >
        <PlusIcon />
        Catat pesanan baru
      </Button>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari Bu Enah, warung, tape ketan..."
          className="h-12 rounded-2xl pl-9 text-base"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${
              filter === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeOrders.length === 0 ? (
        <EmptyState
          title="Belum ada pesanan aktif"
          description="Catat pesanan baru supaya pemilik tidak lupa siapa yang pesan dan kapan harus siap."
          actionLabel="Catat pesanan"
          href="/pesanan/baru"
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="Tidak ketemu"
          description="Coba nama lain, atau ganti saringan status."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} onStatus={setStatus} />
          ))}
        </div>
      )}

    </div>
  )
}
