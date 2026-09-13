"use client"

import { useMemo, useState } from "react"
import { ChoiceChips } from "@/components/choice-chips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FINANCE_CATEGORY_META, FINANCE_KIND_META } from "@/lib/constants"
import { addDays, parseDateInput, startOfDay, toDateInputValue } from "@/lib/dates"
import { formatRupiah } from "@/lib/format"
import type { FinanceCategory, FinanceDraft, FinanceKind } from "@/lib/types"

type DatePreset = "today" | "yesterday" | "custom"

function categoriesFor(kind: FinanceKind): FinanceCategory[] {
  return (Object.keys(FINANCE_CATEGORY_META) as FinanceCategory[]).filter((id) =>
    FINANCE_CATEGORY_META[id].kinds.includes(kind)
  )
}

function defaultCategory(kind: FinanceKind): FinanceCategory {
  return kind === "masuk" ? "penjualan" : "bahan"
}

export function FinanceForm({
  initialKind,
  onSubmit,
}: {
  initialKind: FinanceKind
  onSubmit: (draft: FinanceDraft) => void
}) {
  const [kind, setKind] = useState<FinanceKind>(initialKind)
  const [category, setCategory] = useState<FinanceCategory>(defaultCategory(initialKind))
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [datePreset, setDatePreset] = useState<DatePreset>("today")
  const [dateValue, setDateValue] = useState(toDateInputValue(new Date()))
  const [error, setError] = useState("")

  const categoryOptions = useMemo(
    () =>
      categoriesFor(kind).map((id) => ({
        value: id,
        label: FINANCE_CATEGORY_META[id].label,
      })),
    [kind]
  )

  const changeKind = (next: FinanceKind) => {
    setKind(next)
    if (!FINANCE_CATEGORY_META[category].kinds.includes(next)) {
      setCategory(defaultCategory(next))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) {
      setError("Isi jumlah uangnya.")
      return
    }

    const now = new Date()
    const day =
      datePreset === "today"
        ? now
        : datePreset === "yesterday"
          ? addDays(now, -1)
          : parseDateInput(dateValue)

    onSubmit({
      kind,
      category,
      amount: value,
      note: note.trim(),
      occurredAt: startOfDay(day).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Masuk atau keluar?</Label>
        <ChoiceChips
          value={kind}
          onChange={changeKind}
          options={[
            { value: "masuk", label: FINANCE_KIND_META.masuk.label },
            { value: "keluar", label: FINANCE_KIND_META.keluar.label },
          ]}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Untuk apa?</Label>
        <ChoiceChips value={category} onChange={setCategory} options={categoryOptions} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-semibold">
          Jumlah
        </Label>
        <Input
          id="amount"
          type="number"
          min={0}
          inputMode="numeric"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Contoh: 50000"
          onFocus={(event) => event.currentTarget.select()}
          className="h-12 rounded-2xl px-3 text-base"
        />
        {Number(amount) > 0 ? (
          <p className="text-sm text-muted-foreground">{formatRupiah(Number(amount))}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Kapan?</Label>
        <ChoiceChips
          value={datePreset}
          onChange={(preset) => {
            setDatePreset(preset)
            if (preset !== "custom") {
              const day = preset === "today" ? new Date() : addDays(new Date(), -1)
              setDateValue(toDateInputValue(day))
            }
          }}
          options={[
            { value: "today", label: "Hari ini" },
            { value: "yesterday", label: "Kemarin" },
            { value: "custom", label: "Tanggal lain" },
          ]}
        />
        {datePreset === "custom" ? (
          <Input
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className="mt-2 h-12 rounded-2xl px-3 text-base"
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-semibold">
          Catatan (opsional)
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Contoh: beli ketan di pasar, penjualan Bu Enah"
          className="min-h-20 rounded-2xl px-3 text-base"
        />
      </div>

      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

      <Button type="submit" className="h-14 w-full rounded-2xl text-base font-semibold">
        Simpan catatan
      </Button>
    </form>
  )
}
