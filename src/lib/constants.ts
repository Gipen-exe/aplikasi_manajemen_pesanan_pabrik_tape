import type {
  Fulfillment,
  OrderSource,
  OrderStatus,
  PaymentStatus,
  TimeSlot,
} from "./types"

export const APP_NAME = "Tape Ketan Dasiti"
export const APP_PLACE = "Desa Leuwidingding, Cirebon"
export const PRODUCT_NAME = "Tape Ketan"
export const STORAGE_KEY = "tape-ketan-dasiti-orders-v1"

export const PACKAGES = [
  { id: "ember-besar", name: "Ember besar", price: 110_000 },
  { id: "ember-kecil", name: "Ember kecil", price: 75_000 },
  { id: "kotak-3000", name: "Kotak 3000ml", price: 30_000 },
  { id: "kotak-2000", name: "Kotak 2000ml", price: 25_000 },
  { id: "kotak-1500", name: "Kotak 1500ml", price: 20_000 },
  { id: "custom", name: "Wadah custom", price: null },
] as const

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
  siap: { label: "Siap diambil/diantar", short: "Siap" },
  selesai: { label: "Selesai", short: "Selesai" },
  batal: { label: "Dibatalkan", short: "Batal" },
}

export const PAYMENT_META: Record<PaymentStatus, { label: string }> = {
  belum: { label: "Belum bayar" },
  dp: { label: "Sudah DP" },
  lunas: { label: "Lunas" },
}

export const SOURCE_META: Record<OrderSource, { label: string }> = {
  whatsapp: { label: "WhatsApp" },
  datang: { label: "Datang langsung" },
  titip: { label: "Titip orang" },
  lain: { label: "Lainnya" },
}

export const FULFILLMENT_META: Record<
  Fulfillment,
  { label: string; verb: string }
> = {
  ambil: { label: "Ambil di tempat", verb: "Ambil" },
  antar: { label: "Diantar ke rumah", verb: "Antar" },
}

export const ACTIVE_STATUSES: OrderStatus[] = ["baru", "diproses", "siap"]
export const ARCHIVE_STATUSES: OrderStatus[] = ["selesai", "batal"]
