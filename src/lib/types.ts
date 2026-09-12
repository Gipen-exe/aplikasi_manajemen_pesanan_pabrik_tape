export type OrderStatus = "baru" | "diproses" | "siap" | "selesai" | "batal"
export type PaymentStatus = "belum" | "dp" | "lunas"
export type Fulfillment = "ambil" | "antar"
export type TimeSlot = "pagi" | "siang" | "sore" | "malam" | "custom"

export type Order = {
  id: string
  customerName: string
  phone: string
  productId: string
  productLabel: string
  quantity: number
  unit: string
  dueAt: string
  timeSlot: TimeSlot
  timeLabel: string
  fulfillment: Fulfillment
  address: string
  notes: string
  urgent: boolean
  payment: PaymentStatus
  price: number | null
  status: OrderStatus
  createdAt: string
  updatedAt: string
  isSample?: boolean
}

export type OrderDraft = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "isSample"
>
