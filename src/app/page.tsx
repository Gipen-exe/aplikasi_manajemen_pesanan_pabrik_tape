"use client"

import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { LoadingScreen } from "@/components/loading-screen"
import { OrderCard } from "@/components/orders/order-card"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/hooks/use-orders"
import { formatLongDate, greetingFor } from "@/lib/dates"

export default function HomePage() {
  const { ready, activeOrders, summary, hasSampleData, clearSamples, setStatus } =
    useOrders()

  if (!ready) return <LoadingScreen />

  const headline =
    summary.overdue > 0
      ? `${summary.overdue} pesanan sudah lewat janji. Didahulukan dulu.`
      : summary.today > 0
        ? `Hari ini ada ${summary.today} pesanan yang perlu diselesaikan.`
        : summary.active > 0
          ? `${summary.active} pesanan masih mengantri.`
          : "Belum ada pesanan yang menunggu."

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm text-muted-foreground">{greetingFor()}</p>
        <h2 className="font-heading text-2xl leading-tight">{formatLongDate(new Date())}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">{headline}</p>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <SummaryChip label="Terlambat" value={summary.overdue} tone="urgent" />
        <SummaryChip label="Hari ini" value={summary.today} tone="today" />
        <SummaryChip label="Hutang" value={summary.debt} tone="debt" />
      </div>

      <Button
        className="h-12 w-full rounded-2xl text-base"
        nativeButton={false}
        render={<Link href="/pesanan/baru" />}
      >
        <PlusIcon />
        Catat pesanan baru
      </Button>

      {hasSampleData ? (
        <div className="rounded-2xl border border-[oklch(0.82_0.06_75)] bg-[oklch(0.96_0.03_85)] px-4 py-3 text-sm">
          <p className="font-medium">Ini contoh pesanan untuk dicoba dulu.</p>
          <p className="mt-1 text-muted-foreground">
            Hapus kalau sudah siap dipakai mencatat pesanan asli.
          </p>
          <button
            type="button"
            onClick={clearSamples}
            className="mt-2 text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Hapus contoh
          </button>
        </div>
      ) : null}

      {activeOrders.length === 0 ? (
        <EmptyState
          title="Antrian masih kosong"
          description="Kalau ada yang pesan Tape Ketan Dasiti, catat di sini supaya tidak lupa siapa yang harus didahulukan."
          actionLabel="Catat pesanan"
          href="/pesanan/baru"
        />
      ) : (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <p className="font-heading text-lg">Didahulukan dulu</p>
            <p className="text-xs text-muted-foreground">
              yang paling cepat diambil atau diantar
            </p>
          </div>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatus={setStatus} />
          ))}
        </section>
      )}

    </div>
  )
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "urgent" | "today" | "debt"
}) {
  const tones = {
    urgent: "bg-[oklch(0.95_0.03_35)] text-[oklch(0.42_0.12_30)]",
    today: "bg-[oklch(0.95_0.04_80)] text-[oklch(0.42_0.1_55)]",
    debt: "bg-[oklch(0.95_0.03_35)] text-[oklch(0.42_0.12_30)]",
  }

  return (
    <div className={`rounded-2xl px-3 py-3 ${tones[tone]}`}>
      <p className="font-heading text-2xl leading-none">{value}</p>
      <p className="mt-1 text-xs font-medium">{label}</p>
    </div>
  )
}
