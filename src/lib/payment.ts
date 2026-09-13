import type { Order } from "./types"

export function remainingDebt(order: Pick<Order, "price" | "paidAmount">) {
  if (order.price == null) return 0
  return Math.max(0, order.price - (order.paidAmount || 0))
}

export function settledAmount(
  payment: Order["payment"],
  price: number | null,
  paidAmount: number
) {
  if (payment === "lunas") return price ?? paidAmount
  if (payment === "belum") return 0
  return paidAmount
}
