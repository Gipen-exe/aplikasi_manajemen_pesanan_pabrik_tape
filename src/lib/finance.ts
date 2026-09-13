import { isSameDay, isSameMonth } from "./dates"
import type { FinanceEntry } from "./types"

export function summarizeFinance(entries: FinanceEntry[], now = new Date()) {
  let todayIn = 0
  let todayOut = 0
  let monthIn = 0
  let monthOut = 0

  for (const entry of entries) {
    const when = new Date(entry.occurredAt)
    const amount = entry.amount || 0
    if (entry.kind === "masuk") {
      if (isSameDay(when, now)) todayIn += amount
      if (isSameMonth(when, now)) monthIn += amount
    } else {
      if (isSameDay(when, now)) todayOut += amount
      if (isSameMonth(when, now)) monthOut += amount
    }
  }

  return {
    todayIn,
    todayOut,
    monthIn,
    monthOut,
    monthNet: monthIn - monthOut,
  }
}

export function sortFinanceEntries(entries: FinanceEntry[]) {
  return [...entries].sort((a, b) => {
    const byDay = new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    if (byDay !== 0) return byDay
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
