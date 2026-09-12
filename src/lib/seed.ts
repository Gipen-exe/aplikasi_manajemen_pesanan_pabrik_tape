import { PRODUCTS } from "./constants"
import { addDays, combineDateAndSlot, startOfDay } from "./dates"
import { createId } from "./format"
import type { Order } from "./types"

function product(id: (typeof PRODUCTS)[number]["id"]) {
  const found = PRODUCTS.find((item) => item.id === id)
  return {
    productId: found?.id ?? id,
    productLabel: found?.name ?? "Tape",
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
      ...product("singkong"),
      quantity: 5,
      unit: "kg",
      dueAt: combineDateAndSlot(addDays(today, -1), "sore").toISOString(),
      timeSlot: "sore",
      timeLabel: "Sore",
      fulfillment: "ambil",
      address: "",
      notes: "Langganan. Biasanya diambil sendiri setelah ashar.",
      urgent: true,
      payment: "lunas",
      price: 75000,
      status: "diproses",
      createdAt: stamp(26 * 60),
      updatedAt: stamp(40),
    },
    {
      customerName: "Pak Dedi — Warung Pasar",
      phone: "085712345678",
      ...product("singkong"),
      quantity: 10,
      unit: "bungkus",
      dueAt: combineDateAndSlot(today, "pagi").toISOString(),
      timeSlot: "pagi",
      timeLabel: "Pagi",
      fulfillment: "antar",
      address: "Pasar Greged, dekat pintu masuk",
      notes: "Untuk stok warung. Kalau bisa sampai sebelum pasar ramai.",
      urgent: true,
      payment: "dp",
      price: 120000,
      status: "baru",
      createdAt: stamp(18 * 60),
      updatedAt: stamp(18 * 60),
    },
    {
      customerName: "Teh Rina",
      phone: "089876543210",
      ...product("ketan"),
      quantity: 2,
      unit: "toples",
      dueAt: combineDateAndSlot(today, "sore").toISOString(),
      timeSlot: "sore",
      timeLabel: "Sore",
      fulfillment: "ambil",
      address: "",
      notes: "Untuk acara keluarga. Minta yang manis.",
      urgent: false,
      payment: "belum",
      price: 50000,
      status: "baru",
      createdAt: stamp(8 * 60),
      updatedAt: stamp(8 * 60),
    },
    {
      customerName: "Kang Asep",
      phone: "081298765432",
      ...product("campuran"),
      quantity: 3,
      unit: "kg",
      dueAt: combineDateAndSlot(addDays(today, 1), "siang").toISOString(),
      timeSlot: "siang",
      timeLabel: "Siang",
      fulfillment: "ambil",
      address: "",
      notes: "",
      urgent: false,
      payment: "belum",
      price: null,
      status: "baru",
      createdAt: stamp(5 * 60),
      updatedAt: stamp(5 * 60),
    },
    {
      customerName: "Bu Siti Rohmah",
      phone: "082112223333",
      ...product("singkong"),
      quantity: 2,
      unit: "kg",
      dueAt: combineDateAndSlot(today, "malam").toISOString(),
      timeSlot: "malam",
      timeLabel: "Malam",
      fulfillment: "antar",
      address: "Blok Cibogo, dekat mushola",
      notes: "Titip ke anaknya kalau beliau belum pulang.",
      urgent: false,
      payment: "lunas",
      price: 30000,
      status: "siap",
      createdAt: stamp(30 * 60),
      updatedAt: stamp(20),
    },
    {
      customerName: "Haji Udin",
      phone: "",
      ...product("ketan"),
      quantity: 1,
      unit: "toples",
      dueAt: combineDateAndSlot(addDays(today, -2), "siang").toISOString(),
      timeSlot: "siang",
      timeLabel: "Siang",
      fulfillment: "ambil",
      address: "",
      notes: "Sudah diambil kemarin.",
      urgent: false,
      payment: "lunas",
      price: 25000,
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
