import { FINANCE_STORAGE_KEY, STORAGE_KEY } from "./constants"
import type { FinanceEntry, Order } from "./types"

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

export function loadFinance(): FinanceEntry[] | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(FINANCE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as FinanceEntry[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveFinance(entries: FinanceEntry[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(entries))
}

export function exportBackupPayload(orders: Order[], finance: FinanceEntry[]) {
  return JSON.stringify(
    {
      app: "manajemen-pesanan-pabrik-tape",
      exportedAt: new Date().toISOString(),
      orders,
      finance,
    },
    null,
    2
  )
}

export function parseImportedBackup(raw: string): {
  orders: Order[]
  finance: FinanceEntry[] | undefined
} {
  const parsed = JSON.parse(raw) as
    | { orders?: Order[]; finance?: FinanceEntry[] }
    | Order[]
  const orders = Array.isArray(parsed) ? parsed : parsed.orders
  if (!Array.isArray(orders)) {
    throw new Error("Berkas cadangan tidak dikenali.")
  }
  const finance = Array.isArray(parsed) ? undefined : parsed.finance
  return {
    orders,
    finance: Array.isArray(finance) ? finance : undefined,
  }
}
