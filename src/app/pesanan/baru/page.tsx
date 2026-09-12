"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/app-shell"
import { OrderForm } from "@/components/orders/order-form"
import { useOrders } from "@/hooks/use-orders"

export default function NewOrderPage() {
  const router = useRouter()
  const { addOrder } = useOrders()

  return (
    <>
      <PageHeader
        title="Catat pesanan"
        description="Isi nama, tape yang dipesan, dan kapan harus siap."
        backHref="/"
      />
      <div className="px-4 pt-5">
        <OrderForm
          submitLabel="Simpan pesanan"
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
