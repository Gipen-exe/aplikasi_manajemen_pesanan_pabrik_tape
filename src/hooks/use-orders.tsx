"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { STORAGE_KEY } from "@/lib/constants"
import { createId } from "@/lib/format"
import { isActiveOrder, sortByPriority, summarizeQueue } from "@/lib/priority"
import { createSeedOrders } from "@/lib/seed"
import { loadOrders, saveOrders } from "@/lib/storage"
import type { Order, OrderDraft, OrderStatus } from "@/lib/types"

const EMPTY: Order[] = []
let memory: Order[] | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      memory = null
      emit()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function read(): Order[] {
  if (memory) return memory
  const existing = loadOrders()
  if (existing) {
    memory = existing
    return memory
  }
  memory = createSeedOrders()
  saveOrders(memory)
  return memory
}

function write(next: Order[]) {
  memory = next
  saveOrders(next)
  emit()
}

type OrdersContextValue = {
  ready: boolean
  orders: Order[]
  activeOrders: Order[]
  archivedOrders: Order[]
  hasSampleData: boolean
  summary: ReturnType<typeof summarizeQueue>
  addOrder: (draft: OrderDraft) => Order
  updateOrder: (id: string, patch: Partial<Order>) => void
  setStatus: (id: string, status: OrderStatus) => void
  removeOrder: (id: string) => void
  replaceAll: (orders: Order[]) => void
  clearSamples: () => void
  resetWithSamples: () => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const orders = useSyncExternalStore(subscribe, read, () => EMPTY)
  const ready = orders !== EMPTY

  const addOrder = useCallback((draft: OrderDraft) => {
    const now = new Date().toISOString()
    const order: Order = {
      ...draft,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    }
    write([order, ...read()])
    return order
  }, [])

  const updateOrder = useCallback((id: string, patch: Partial<Order>) => {
    write(
      read().map((order) =>
        order.id === id
          ? { ...order, ...patch, updatedAt: new Date().toISOString() }
          : order
      )
    )
  }, [])

  const setStatus = useCallback((id: string, status: OrderStatus) => {
    write(
      read().map((order) =>
        order.id === id
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    )
  }, [])

  const removeOrder = useCallback((id: string) => {
    write(read().filter((order) => order.id !== id))
  }, [])

  const replaceAll = useCallback((next: Order[]) => {
    write(next)
  }, [])

  const clearSamples = useCallback(() => {
    write(read().filter((order) => !order.isSample))
  }, [])

  const resetWithSamples = useCallback(() => {
    write(createSeedOrders())
  }, [])

  const value = useMemo<OrdersContextValue>(() => {
    const activeOrders = sortByPriority(orders.filter(isActiveOrder))
    const archivedOrders = [...orders.filter((order) => !isActiveOrder(order))].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    return {
      ready,
      orders,
      activeOrders,
      archivedOrders,
      hasSampleData: orders.some((order) => order.isSample),
      summary: summarizeQueue(orders),
      addOrder,
      updateOrder,
      setStatus,
      removeOrder,
      replaceAll,
      clearSamples,
      resetWithSamples,
    }
  }, [
    addOrder,
    clearSamples,
    orders,
    ready,
    removeOrder,
    replaceAll,
    resetWithSamples,
    setStatus,
    updateOrder,
  ])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders harus dipakai di dalam OrdersProvider")
  }
  return context
}

export function useOrder(id: string | undefined) {
  const { orders, ready } = useOrders()
  return {
    ready,
    order: orders.find((item) => item.id === id),
  }
}
