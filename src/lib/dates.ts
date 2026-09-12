import type { TimeSlot } from "./types"
import { TIME_SLOTS } from "./constants"

export function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function greetingFor(now = new Date()) {
  const hour = now.getHours()
  if (hour < 11) return "Selamat pagi"
  if (hour < 15) return "Selamat siang"
  if (hour < 18) return "Selamat sore"
  return "Selamat malam"
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(date)
}

export function formatClock(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function relativeDayLabel(date: Date, now = new Date()) {
  const today = startOfDay(now)
  const target = startOfDay(date)
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return "Hari ini"
  if (diff === 1) return "Besok"
  if (diff === 2) return "Lusa"
  if (diff === -1) return "Kemarin"
  if (diff < 0) return `${Math.abs(diff)} hari lalu`
  return formatShortDate(date)
}

export function combineDateAndSlot(
  date: Date,
  slot: TimeSlot,
  customHour = 16,
  customMinute = 0
) {
  const next = new Date(date)
  if (slot === "custom") {
    next.setHours(customHour, customMinute, 0, 0)
    return next
  }
  const found = TIME_SLOTS.find((item) => item.id === slot)
  next.setHours(found?.hour ?? 16, 0, 0, 0)
  return next
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function toTimeInputValue(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function slotLabel(slot: TimeSlot, dueAt: string) {
  if (slot === "custom") return formatClock(new Date(dueAt))
  return TIME_SLOTS.find((item) => item.id === slot)?.label ?? "Sore"
}
