import { FULFILLMENT_META, PAYMENT_META } from "./constants"
import { formatClock, relativeDayLabel } from "./dates"
import { getDueKind } from "./priority"
import type { Order } from "./types"

export function formatQuantity(order: Pick<Order, "quantity" | "unit">) {
  const qty =
    Number.isInteger(order.quantity) ? String(order.quantity) : order.quantity.toString()
  return `${qty} ${order.unit}`
}

export function formatProductLine(order: Order) {
  return `${formatQuantity(order)} ${order.productLabel}`
}

export function formatDueLine(order: Order, now = new Date()) {
  const due = new Date(order.dueAt)
  const day = relativeDayLabel(due, now)
  const clock = order.timeSlot === "custom" ? formatClock(due) : order.timeLabel
  const verb = FULFILLMENT_META[order.fulfillment].verb
  return `${verb} · ${day} · ${clock}`
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPayment(order: Order) {
  if (order.price != null && order.price > 0) {
    return `${PAYMENT_META[order.payment].label} · ${formatRupiah(order.price)}`
  }
  return PAYMENT_META[order.payment].label
}

export function dueBadgeLabel(order: Order, now = new Date()) {
  const kind = getDueKind(order, now)
  if (kind === "overdue") return "Terlambat"
  if (kind === "today") return "Hari ini"
  if (kind === "tomorrow") return "Besok"
  return relativeDayLabel(new Date(order.dueAt), now)
}

export function whatsappUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null
  const intl = digits.startsWith("62")
    ? digits
    : digits.startsWith("0")
      ? `62${digits.slice(1)}`
      : digits
  const url = new URL(`https://wa.me/${intl}`)
  if (message) url.searchParams.set("text", message)
  return url.toString()
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `pesanan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
