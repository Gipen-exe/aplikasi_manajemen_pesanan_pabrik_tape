import { ACTIVE_STATUSES } from "./constants"
import { isSameDay, startOfDay } from "./dates"
import type { Order } from "./types"

export type DueKind = "overdue" | "today" | "tomorrow" | "later"

export function isActiveOrder(order: Order) {
  return ACTIVE_STATUSES.includes(order.status)
}

export function getDueKind(order: Order, now = new Date()): DueKind {
  const due = new Date(order.dueAt)
  if (due.getTime() < now.getTime() && !isSameDay(due, now)) return "overdue"
  if (isSameDay(due, now)) {
    if (due.getTime() < now.getTime()) return "overdue"
    return "today"
  }
  if (isSameDay(due, new Date(now.getTime() + 86_400_000))) return "tomorrow"
  return "later"
}

export function priorityScore(order: Order, now = new Date()) {
  if (!isActiveOrder(order)) return Number.MAX_SAFE_INTEGER

  const due = new Date(order.dueAt).getTime()
  const created = new Date(order.createdAt).getTime()
  const kind = getDueKind(order, now)

  let score = 0
  if (order.urgent) score -= 20_000
  if (kind === "overdue") score -= 10_000
  if (kind === "today") score -= 4_000
  if (kind === "tomorrow") score -= 1_000
  if (order.status === "siap") score -= 300
  if (order.status === "diproses") score -= 120

  score += Math.floor(due / 60_000)
  score += created / 1e15
  return score
}

export function sortByPriority(orders: Order[], now = new Date()) {
  return [...orders].sort((a, b) => priorityScore(a, now) - priorityScore(b, now))
}

export function summarizeQueue(orders: Order[], now = new Date()) {
  const active = orders.filter(isActiveOrder)
  return {
    active: active.length,
    urgent: active.filter((order) => order.urgent).length,
    overdue: active.filter((order) => getDueKind(order, now) === "overdue").length,
    today: active.filter((order) => {
      const kind = getDueKind(order, now)
      return kind === "today" || kind === "overdue"
    }).length,
    ready: active.filter((order) => order.status === "siap").length,
    dueTodayCount: active.filter((order) =>
      isSameDay(new Date(order.dueAt), now)
    ).length,
    createdToday: orders.filter((order) =>
      isSameDay(new Date(order.createdAt), now)
    ).length,
  }
}

export function isDueOn(order: Order, day: Date) {
  return isSameDay(new Date(order.dueAt), startOfDay(day))
}
