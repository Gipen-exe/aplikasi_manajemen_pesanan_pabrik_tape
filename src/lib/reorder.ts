import { TIME_SLOTS } from "./constants"
import { combineDateAndSlot } from "./dates"
import type { Order } from "./types"

export function reorderHref(id: string) {
  return `/pesanan/baru?dari=${encodeURIComponent(id)}`
}

export function createReorderDraft(order: Order, now = new Date()): Order {
  const timeSlot = order.timeSlot === "custom" ? "sore" : order.timeSlot
  const due = combineDateAndSlot(now, timeSlot)
  const { isSample: _sample, ...rest } = order

  return {
    ...rest,
    notes: "",
    dueAt: due.toISOString(),
    timeSlot,
    timeLabel: TIME_SLOTS.find((item) => item.id === timeSlot)?.label ?? "Sore",
    payment: "belum",
    paidAmount: 0,
    status: "baru",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}
