"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/app-shell"
import { LoadingScreen } from "@/components/loading-screen"
import { OrderForm } from "@/components/orders/order-form"
import { useOrder, useOrders } from "@/hooks/use-orders"
import { createReorderDraft } from "@/lib/reorder"

export function NewOrderScreen({ fromId }: { fromId?: string }) {
  const router = useRouter()
  const { addOrder } = useOrders()
  const { ready, order: source } = useOrder(fromId)
  const reordering = Boolean(fromId)

  if (!ready) return <LoadingScreen />

  const initial = source ? createReorderDraft(source) : undefined
  const missingSource = reordering && !source

  return (
    <>
      <PageHeader
        title={initial ? "Pesan lagi" : "Catat pesanan"}
        description={
          initial
            ? "Nama dan wadah sudah diisi. Cek tanggal, lalu simpan."
            : "Isi nama, wadah Tape Ketan, dan kapan harus diambil atau diantar."
        }
        backHref={source ? `/pesanan/${source.id}` : "/"}
      />
      <div className="px-4 pt-5">
        {missingSource ? (
          <p className="rounded-2xl bg-secondary/80 px-4 py-3 text-sm leading-relaxed">
            Pesanan lama tidak ketemu di HP ini. Isi seperti pesanan baru saja.
          </p>
        ) : null}
        <OrderForm
          initial={initial}
          notice={
            initial
              ? `Ini pesanan ulang untuk ${initial.customerName}. Cek tanggal dan jumlah, lalu simpan.`
              : undefined
          }
          submitLabel={initial ? "Simpan pesanan ulang" : "Simpan pesanan"}
          onSubmit={(draft) => {
            const order = addOrder(draft)
            toast.success(`Pesanan ${order.customerName} sudah tercatat.`)
            router.push(`/pesanan/${order.id}`)
          }}
        />
      </div>
    </>
  )
}
