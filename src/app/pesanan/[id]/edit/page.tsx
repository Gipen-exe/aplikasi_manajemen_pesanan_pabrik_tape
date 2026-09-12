"use client"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/app-shell"
import { LoadingScreen } from "@/components/loading-screen"
import { OrderForm } from "@/components/orders/order-form"
import { useOrder, useOrders } from "@/hooks/use-orders"

export default function EditOrderPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { ready, order } = useOrder(params.id)
  const { updateOrder } = useOrders()

  if (!ready) return <LoadingScreen />

  if (!order) {
    return (
      <>
        <PageHeader title="Pesanan tidak ketemu" backHref="/" />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Ubah pesanan"
        description={order.customerName}
        backHref={`/pesanan/${order.id}`}
      />
      <div className="px-4 pt-5">
        <OrderForm
          initial={order}
          submitLabel="Simpan perubahan"
          onSubmit={(draft) => {
            updateOrder(order.id, draft)
            toast.success("Pesanan sudah diperbarui.")
            router.push(`/pesanan/${order.id}`)
          }}
        />
      </div>
    </>
  )
}
