import type { Fulfillment, OrderStatus, PaymentStatus, TimeSlot } from "./types"

export const APP_NAME = "Tape Leuwidingding"
export const APP_PLACE = "Desa Leuwidingding, Cirebon"
export const STORAGE_KEY = "tape-leuwidingding-orders-v1"

export const PRODUCTS = [
  { id: "singkong", name: "Tape Singkong", defaultUnit: "kg" },
  { id: "ketan", name: "Tape Ketan", defaultUnit: "toples" },
  { id: "campuran", name: "Campuran", defaultUnit: "bungkus" },
  { id: "lainnya", name: "Lainnya", defaultUnit: "bungkus" },
] as const

export const UNITS = ["kg", "bungkus", "toples"] as const

export const TIME_SLOTS: {
  id: TimeSlot
  label: string
  hint: string
  hour: number
}[] = [
  { id: "pagi", label: "Pagi", hint: "sekitar jam 8", hour: 8 },
  { id: "siang", label: "Siang", hint: "sekitar jam 12", hour: 12 },
  { id: "sore", label: "Sore", hint: "sekitar jam 16", hour: 16 },
  { id: "malam", label: "Malam", hint: "sekitar jam 19", hour: 19 },
]

export const STATUS_META: Record<
  OrderStatus,
  { label: string; short: string }
> = {
  baru: { label: "Pesanan baru", short: "Baru" },
  diproses: { label: "Sedang dibuat", short: "Dibuat" },
  siap: { label: "Siap diambil", short: "Siap" },
  selesai: { label: "Selesai", short: "Selesai" },
  batal: { label: "Dibatalkan", short: "Batal" },
}

export const PAYMENT_META: Record<PaymentStatus, { label: string }> = {
  belum: { label: "Belum bayar" },
  dp: { label: "Sudah DP" },
  lunas: { label: "Lunas" },
}

export const FULFILLMENT_META: Record<
  Fulfillment,
  { label: string; verb: string }
> = {
  ambil: { label: "Ambil di tempat", verb: "Ambil" },
  antar: { label: "Diantar", verb: "Antar" },
}

export const ACTIVE_STATUSES: OrderStatus[] = ["baru", "diproses", "siap"]
export const ARCHIVE_STATUSES: OrderStatus[] = ["selesai", "batal"]
