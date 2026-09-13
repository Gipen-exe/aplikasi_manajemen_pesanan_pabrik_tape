"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { FINANCE_STORAGE_KEY } from "@/lib/constants"
import { sortFinanceEntries, summarizeFinance } from "@/lib/finance"
import { createId } from "@/lib/format"
import { loadFinance, saveFinance } from "@/lib/storage"
import type { FinanceDraft, FinanceEntry } from "@/lib/types"

const EMPTY: FinanceEntry[] = []
let memory: FinanceEntry[] | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === FINANCE_STORAGE_KEY) {
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

function withoutSamples(entries: FinanceEntry[]) {
  return entries.filter((entry) => !entry.isSample)
}

function read(): FinanceEntry[] {
  if (memory !== null) return memory
  const existing = loadFinance()
  const cleaned = existing ? withoutSamples(existing) : []
  memory = cleaned
  if (!existing || cleaned.length !== existing.length) saveFinance(memory)
  return memory
}

function write(next: FinanceEntry[]) {
  memory = next
  saveFinance(next)
  emit()
}

type FinanceContextValue = {
  ready: boolean
  entries: FinanceEntry[]
  summary: ReturnType<typeof summarizeFinance>
  addEntry: (draft: FinanceDraft) => FinanceEntry
  removeEntry: (id: string) => void
  replaceAll: (entries: FinanceEntry[]) => void
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const entries = useSyncExternalStore(subscribe, read, () => EMPTY)
  const ready = useSyncExternalStore(subscribe, () => true, () => false)

  const addEntry = useCallback((draft: FinanceDraft) => {
    const entry: FinanceEntry = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
    }
    write([entry, ...read()])
    return entry
  }, [])

  const removeEntry = useCallback((id: string) => {
    write(read().filter((entry) => entry.id !== id))
  }, [])

  const replaceAll = useCallback((next: FinanceEntry[]) => {
    write(withoutSamples(next))
  }, [])

  const value = useMemo<FinanceContextValue>(() => {
    return {
      ready,
      entries: sortFinanceEntries(entries),
      summary: summarizeFinance(entries),
      addEntry,
      removeEntry,
      replaceAll,
    }
  }, [addEntry, entries, ready, removeEntry, replaceAll])

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance harus dipakai di dalam FinanceProvider")
  }
  return context
}
