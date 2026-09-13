export type OrderStatus = "baru" | "diproses" | "siap" | "selesai" | "batal"
export type PaymentStatus = "belum" | "dp" | "lunas"
export type Fulfillment = "ambil" | "antar"
export type TimeSlot = "pagi" | "siang" | "sore" | "malam" | "custom"
export type OrderSource = "whatsapp" | "datang" | "titip" | "lain"

export type Order = {
  id: string
  customerName: string
  phone: string
  source: OrderSource
  packageId: string
  packageLabel: string
  quantity: number
  unitPrice: number | null
  dueAt: string
  timeSlot: TimeSlot
  timeLabel: string
  fulfillment: Fulfillment
  address: string
  notes: string
  payment: PaymentStatus
  price: number | null
  paidAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  isSample?: boolean
}

export type OrderDraft = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "isSample"
>

export type FinanceKind = "masuk" | "keluar"
export type FinanceCategory = "penjualan" | "bahan" | "wadah" | "gas" | "lain"

export type FinanceEntry = {
  id: string
  kind: FinanceKind
  category: FinanceCategory
  amount: number
  note: string
  occurredAt: string
  createdAt: string
  isSample?: boolean
}

export type FinanceDraft = Omit<FinanceEntry, "id" | "createdAt" | "isSample">
