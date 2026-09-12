import { STORAGE_KEY } from "./constants"
import type { Order } from "./types"

export function loadOrders(): Order[] | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Order[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function exportOrdersPayload(orders: Order[]) {
  return JSON.stringify(
    {
      app: "tape-leuwidingding",
      exportedAt: new Date().toISOString(),
      orders,
    },
    null,
    2
  )
}

export function parseImportedOrders(raw: string): Order[] {
  const parsed = JSON.parse(raw) as { orders?: Order[] } | Order[]
  const orders = Array.isArray(parsed) ? parsed : parsed.orders
  if (!Array.isArray(orders)) {
    throw new Error("Berkas cadangan tidak dikenali.")
  }
  return orders
}
