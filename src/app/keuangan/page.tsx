"use client"

import Link from "next/link"
import { toast } from "sonner"
import { EmptyState } from "@/components/empty-state"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { useFinance } from "@/hooks/use-finance"
import { FINANCE_CATEGORY_META, FINANCE_KIND_META } from "@/lib/constants"
import { formatLongDate, isSameDay, relativeDayLabel } from "@/lib/dates"
import { formatRupiah } from "@/lib/format"

export default function FinancePage() {
  const { ready, entries, summary, removeEntry } = useFinance()

  if (!ready) return <LoadingScreen />

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl">Catatan uang</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Catat uang masuk dan keluar, supaya pengeluaran bahan tidak lupa.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SummaryChip label="Masuk hari ini" value={summary.todayIn} tone="in" />
        <SummaryChip label="Keluar hari ini" value={summary.todayOut} tone="out" />
        <SummaryChip label="Sisa bulan ini" value={summary.monthNet} tone="net" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="h-12 rounded-2xl text-base"
          nativeButton={false}
          render={<Link href="/keuangan/baru?jenis=masuk" />}
        >
          Uang masuk
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-2xl text-base"
          nativeButton={false}
          render={<Link href="/keuangan/baru?jenis=keluar" />}
        >
          Uang keluar
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="Belum ada catatan uang"
          description="Kalau ada penjualan atau belanja bahan, catat di sini supaya ketahuan uangnya ke mana."
          actionLabel="Catat uang masuk"
          href="/keuangan/baru?jenis=masuk"
        />
      ) : (
        <section className="space-y-3">
          <p className="font-heading text-lg">Riwayat</p>
          {entries.map((entry) => {
            const when = new Date(entry.occurredAt)
            const dayLabel = isSameDay(when, new Date())
              ? "Hari ini"
              : relativeDayLabel(when)
            return (
              <article
                key={entry.id}
                className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/8"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {FINANCE_KIND_META[entry.kind].label} · {dayLabel}
                    </p>
                    <p className="font-heading mt-1 text-xl leading-tight">
                      {entry.kind === "keluar" ? "− " : ""}
                      {formatRupiah(entry.amount)}
                    </p>
                    <p className="mt-1 text-sm">
                      {FINANCE_CATEGORY_META[entry.category].label}
                    </p>
                    {entry.note ? (
                      <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatLongDate(when)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-10 rounded-2xl"
                    onClick={() => {
                      removeEntry(entry.id)
                      toast.success("Catatan uang dihapus.")
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              </article>
            )
          })}
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
  tone: "in" | "out" | "net"
}) {
  const tones = {
    in: "bg-[oklch(0.95_0.04_145)] text-[oklch(0.38_0.08_145)]",
    out: "bg-[oklch(0.95_0.03_35)] text-[oklch(0.42_0.12_30)]",
    net: "bg-[oklch(0.95_0.04_80)] text-[oklch(0.42_0.1_55)]",
  }

  return (
    <div className={`rounded-2xl px-3 py-3 ${tones[tone]}`}>
      <p className="font-heading text-lg leading-none">{formatRupiah(value)}</p>
      <p className="mt-1.5 text-[11px] font-medium leading-tight">{label}</p>
    </div>
  )
}
