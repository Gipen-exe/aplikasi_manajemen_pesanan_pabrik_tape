"use client"

import Link from "next/link"
import { MapPinIcon, MessageCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DebtBadge, DueBadge, StatusBadge } from "@/components/orders/status-badge"
import {
  formatDueLine,
  formatPayment,
  formatProductLine,
  orderWhatsappMessage,
  whatsappUrl,
} from "@/lib/format"
import { reorderHref } from "@/lib/reorder"
import type { Order, OrderStatus } from "@/lib/types"

const nextAction: Partial<
  Record<OrderStatus, { status: OrderStatus; label: string }>
> = {
  baru: { status: "diproses", label: "Mulai buat" },
  diproses: { status: "siap", label: "Tandai siap" },
  siap: { status: "selesai", label: "Selesai" },
}

export function OrderCard({
  order,
  onStatus,
}: {
  order: Order
  onStatus?: (id: string, status: OrderStatus) => void
}) {
  const action = nextAction[order.status]
  const wa = order.phone ? whatsappUrl(order.phone, orderWhatsappMessage(order)) : null

  return (
    <article className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/8">
      <Link href={`/pesanan/${order.id}`} className="block space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <DueBadge order={order} />
          <DebtBadge order={order} />
          <StatusBadge status={order.status} />
        </div>
        <div>
          <h3 className="font-heading text-xl leading-tight text-foreground">
            {order.customerName}
          </h3>
          <p className="mt-1 text-base font-medium text-[oklch(0.42_0.1_50)]">
            {formatProductLine(order)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{formatDueLine(order)}</p>
          {order.fulfillment === "antar" && order.address ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
              {order.address}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">{formatPayment(order)}</p>
        </div>
      </Link>

      {action || wa || !onStatus ? (
        <div className="mt-4 flex gap-2">
          {action && onStatus ? (
            <Button
              className="h-12 flex-1 text-base"
              onClick={() => onStatus(order.id, action.status)}
            >
              {action.label}
            </Button>
          ) : (
            <Button
              className="h-12 flex-1 text-base"
              nativeButton={false}
              render={<Link href={reorderHref(order.id)} />}
            >
              Pesan lagi
            </Button>
          )}
          {wa ? (
            <Button
              variant="outline"
              className="h-12 px-3"
              nativeButton={false}
              render={<a href={wa} target="_blank" rel="noreferrer" />}
            >
              <MessageCircleIcon />
              <span className="sr-only">WhatsApp</span>
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
