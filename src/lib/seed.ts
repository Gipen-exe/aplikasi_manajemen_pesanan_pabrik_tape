import { PACKAGES } from "./constants"
import { addDays, combineDateAndSlot, startOfDay } from "./dates"
import { createId } from "./format"
import type { Order } from "./types"

function pack(id: (typeof PACKAGES)[number]["id"], quantity: number) {
  const found = PACKAGES.find((item) => item.id === id)
  const unitPrice = found?.price ?? null
  return {
    packageId: found?.id ?? id,
    packageLabel: found?.name ?? "Wadah custom",
    quantity,
    unitPrice,
    price: unitPrice == null ? null : unitPrice * quantity,
  }
}

export function createSeedOrders(now = new Date()): Order[] {
  const today = startOfDay(now)
  const stamp = (minutesAgo: number) =>
    new Date(now.getTime() - minutesAgo * 60_000).toISOString()

  const rows: Array<Omit<Order, "id" | "isSample">> = [
    {
      customerName: "Bu Enah",
      phone: "081234567890",
      source: "datang",
      ...pack("ember-kecil", 1),
      dueAt: combineDateAndSlot(addDays(today, -1), "sore").toISOString(),
      timeSlot: "sore",
      timeLabel: "Sore",
      fulfillment: "ambil",
      address: "",
      notes: "Langganan. Biasanya diambil sendiri setelah ashar.",
      payment: "lunas",
      paidAmount: 75_000,
      status: "diproses",
      createdAt: stamp(26 * 60),
      updatedAt: stamp(40),
    },
    {
      customerName: "Pak Dedi",
      phone: "085712345678",
      source: "whatsapp",
      ...pack("ember-besar", 2),
      dueAt: combineDateAndSlot(today, "pagi").toISOString(),
      timeSlot: "pagi",
      timeLabel: "Pagi",
      fulfillment: "antar",
      address: "Rumah Pak Dedi, Blok Cibogo, Leuwidingding",
      notes: "Untuk stok warung. Kalau bisa sampai sebelum berangkat jualan.",
      payment: "dp",
      paidAmount: 100_000,
      status: "baru",
      createdAt: stamp(18 * 60),
      updatedAt: stamp(18 * 60),
    },
    {
      customerName: "Teh Rina",
      phone: "089876543210",
      source: "whatsapp",
      ...pack("kotak-3000", 2),
      dueAt: combineDateAndSlot(today, "sore").toISOString(),
      timeSlot: "sore",
      timeLabel: "Sore",
      fulfillment: "ambil",
      address: "",
      notes: "Untuk acara keluarga.",
      payment: "belum",
      paidAmount: 0,
      status: "baru",
      createdAt: stamp(8 * 60),
      updatedAt: stamp(8 * 60),
    },
    {
      customerName: "Kang Asep",
      phone: "081298765432",
      source: "titip",
      packageId: "custom",
      packageLabel: "Stoples kaca",
      quantity: 1,
      unitPrice: 40_000,
      price: 40_000,
      dueAt: combineDateAndSlot(addDays(today, 1), "siang").toISOString(),
      timeSlot: "siang",
      timeLabel: "Siang",
      fulfillment: "ambil",
      address: "",
      notes: "Wadah dari pelanggan. Harga menyesuaikan.",
      payment: "belum",
      paidAmount: 0,
      status: "baru",
      createdAt: stamp(5 * 60),
      updatedAt: stamp(5 * 60),
    },
    {
      customerName: "Bu Siti Rohmah",
      phone: "082112223333",
      source: "datang",
      ...pack("kotak-1500", 1),
      dueAt: combineDateAndSlot(today, "malam").toISOString(),
      timeSlot: "malam",
      timeLabel: "Malam",
      fulfillment: "antar",
      address: "Rumah Bu Siti, dekat mushola Leuwidingding",
      notes: "Titip ke anaknya kalau beliau belum pulang.",
      payment: "lunas",
      paidAmount: 20_000,
      status: "siap",
      createdAt: stamp(30 * 60),
      updatedAt: stamp(20),
    },
    {
      customerName: "Haji Udin",
      phone: "",
      source: "lain",
      ...pack("kotak-2000", 1),
      dueAt: combineDateAndSlot(addDays(today, -2), "siang").toISOString(),
      timeSlot: "siang",
      timeLabel: "Siang",
      fulfillment: "ambil",
      address: "",
      notes: "Sudah diambil kemarin.",
      payment: "lunas",
      paidAmount: 25_000,
      status: "selesai",
      createdAt: stamp(50 * 60),
      updatedAt: stamp(36 * 60),
    },
  ]

  return rows.map((row) => ({
    ...row,
    id: createId(),
    isSample: true,
  }))
}
