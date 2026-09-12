"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  MapPinIcon,
  MessageCircleIcon,
  NotebookPenIcon,
  PhoneIcon,
} from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { LoadingScreen } from "@/components/loading-screen"
import { DueBadge, StatusBadge, UrgentBadge } from "@/components/orders/status-badge"
import { Button } from "@/components/ui/button"
import { useOrder, useOrders } from "@/hooks/use-orders"
import { FULFILLMENT_META, STATUS_META } from "@/lib/constants"
import { formatLongDate } from "@/lib/dates"
import {
  formatDueLine,
  formatPayment,
  formatProductLine,
  whatsappUrl,
} from "@/lib/format"
import type { OrderStatus } from "@/lib/types"

const FLOW: OrderStatus[] = ["baru", "diproses", "siap", "selesai"]

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { ready, order } = useOrder(params.id)
  const { setStatus, removeOrder } = useOrders()

  if (!ready) return <LoadingScreen />

  if (!order) {
    return (
      <>
        <PageHeader title="Pesanan tidak ketemu" backHref="/" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">
          Mungkin sudah dihapus, atau ini contoh yang belum ada di HP ini.
        </p>
      </>
    )
  }

  const wa = order.phone
    ? whatsappUrl(
        order.phone,
        `Assalamualaikum, pesanan ${formatProductLine(order)} atas nama ${order.customerName} dari Tape Leuwidingding.`
      )
    : null

  return (
    <>
      <PageHeader title={order.customerName} backHref="/" />
      <div className="space-y-5 px-4 pt-5 pb-10">
        <div className="flex flex-wrap gap-1.5">
          {order.urgent ? <UrgentBadge /> : null}
          <DueBadge order={order} />
          <StatusBadge status={order.status} />
        </div>

        <section className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/8">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Pesanan
          </p>
          <p className="font-heading mt-1 text-2xl">{formatProductLine(order)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{formatDueLine(order)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {FULFILLMENT_META[order.fulfillment].label}
          </p>
          {order.address ? (
            <p className="mt-2 flex items-start gap-2 text-sm">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              {order.address}
            </p>
          ) : null}
          <p className="mt-3 text-sm font-medium">{formatPayment(order)}</p>
        </section>

        {order.notes ? (
          <section className="rounded-3xl bg-secondary/70 p-4">
            <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <NotebookPenIcon className="size-3.5" />
              Catatan
            </p>
            <p className="mt-2 text-sm leading-relaxed">{order.notes}</p>
          </section>
        ) : null}

        <section className="space-y-2">
          <p className="text-sm font-semibold">Ubah status</p>
          <div className="grid grid-cols-2 gap-2">
            {FLOW.map((status) => (
              <Button
                key={status}
                variant={order.status === status ? "default" : "outline"}
                className="h-12 rounded-2xl text-sm"
                onClick={() => {
                  setStatus(order.id, status)
                  toast.success(`Status jadi ${STATUS_META[status].label.toLowerCase()}.`)
                }}
              >
                {STATUS_META[status].short}
              </Button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          {wa ? (
            <Button
              variant="outline"
              className="h-12 rounded-2xl"
              nativeButton={false}
              render={<a href={wa} target="_blank" rel="noreferrer" />}
            >
              <MessageCircleIcon />
              WhatsApp
            </Button>
          ) : (
            <Button variant="outline" className="h-12 rounded-2xl" disabled>
              <PhoneIcon />
              Tidak ada nomor
            </Button>
          )}
          <Button
            variant="outline"
            className="h-12 rounded-2xl"
            nativeButton={false}
            render={<Link href={`/pesanan/${order.id}/edit`} />}
          >
            Ubah
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Dicatat {formatLongDate(new Date(order.createdAt))}
        </p>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="h-12 flex-1 rounded-2xl"
            onClick={() => {
              setStatus(order.id, "batal")
              toast.success("Pesanan dibatalkan.")
              router.push("/")
            }}
          >
            Batalkan
          </Button>
          <Button
            variant="ghost"
            className="h-12 rounded-2xl"
            onClick={() => {
              removeOrder(order.id)
              toast.success("Pesanan dihapus dari catatan.")
              router.push("/")
            }}
          >
            Hapus
          </Button>
        </div>
      </div>
    </>
  )
}
