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
