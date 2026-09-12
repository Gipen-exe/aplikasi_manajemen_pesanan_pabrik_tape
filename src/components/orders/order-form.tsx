"use client"

import { useMemo, useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { ChoiceChips } from "@/components/choice-chips"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FULFILLMENT_META,
  PAYMENT_META,
  PRODUCTS,
  TIME_SLOTS,
  UNITS,
} from "@/lib/constants"
import {
  addDays,
  combineDateAndSlot,
  parseDateInput,
  startOfDay,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/dates"
import type { Fulfillment, Order, OrderDraft, PaymentStatus, TimeSlot } from "@/lib/types"

type DatePreset = "today" | "tomorrow" | "later" | "custom"

function inferDatePreset(dueAt: string, now = new Date()): DatePreset {
  const due = startOfDay(new Date(dueAt))
  if (due.getTime() === startOfDay(now).getTime()) return "today"
  if (due.getTime() === startOfDay(addDays(now, 1)).getTime()) return "tomorrow"
  if (due.getTime() === startOfDay(addDays(now, 2)).getTime()) return "later"
  return "custom"
}

function emptyDraft(now = new Date()): {
  draft: OrderDraft
  datePreset: DatePreset
  dateValue: string
  timeValue: string
} {
  const due = combineDateAndSlot(now, "sore")
  return {
    datePreset: "today",
    dateValue: toDateInputValue(now),
    timeValue: "16:00",
    draft: {
      customerName: "",
      phone: "",
      productId: "singkong",
      productLabel: "Tape Singkong",
      quantity: 1,
      unit: "kg",
      dueAt: due.toISOString(),
      timeSlot: "sore",
      timeLabel: "Sore",
      fulfillment: "ambil",
      address: "",
      notes: "",
      urgent: false,
      payment: "belum",
      price: null,
      status: "baru",
    },
  }
}

function fromOrder(order: Order) {
  const due = new Date(order.dueAt)
  return {
    datePreset: inferDatePreset(order.dueAt),
    dateValue: toDateInputValue(due),
    timeValue: toTimeInputValue(due),
    draft: {
      customerName: order.customerName,
      phone: order.phone,
      productId: order.productId,
      productLabel: order.productLabel,
      quantity: order.quantity,
      unit: order.unit,
      dueAt: order.dueAt,
      timeSlot: order.timeSlot,
      timeLabel: order.timeLabel,
      fulfillment: order.fulfillment,
      address: order.address,
      notes: order.notes,
      urgent: order.urgent,
      payment: order.payment,
      price: order.price,
      status: order.status,
    } satisfies OrderDraft,
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function OrderForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Order
  submitLabel: string
  onSubmit: (draft: OrderDraft) => void
}) {
  const initialState = useMemo(
    () => (initial ? fromOrder(initial) : emptyDraft()),
    [initial]
  )
  const [draft, setDraft] = useState<OrderDraft>(initialState.draft)
  const [datePreset, setDatePreset] = useState<DatePreset>(initialState.datePreset)
  const [dateValue, setDateValue] = useState(initialState.dateValue)
  const [timeValue, setTimeValue] = useState(initialState.timeValue)
  const [error, setError] = useState("")

  const setProduct = (id: string) => {
    const product = PRODUCTS.find((item) => item.id === id)
    setDraft((current) => ({
      ...current,
      productId: id,
      productLabel: product?.name ?? current.productLabel,
      unit: product?.defaultUnit ?? current.unit,
    }))
  }

  const bumpQty = (delta: number) => {
    setDraft((current) => ({
      ...current,
      quantity: Math.max(0.5, Math.round((current.quantity + delta) * 10) / 10),
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const name = draft.customerName.trim()
    if (!name) {
      setError("Nama pemesan wajib diisi.")
      return
    }
    if (!draft.quantity || draft.quantity <= 0) {
      setError("Jumlah pesanan belum diisi.")
      return
    }

    const now = new Date()
    const day =
      datePreset === "today"
        ? now
        : datePreset === "tomorrow"
          ? addDays(now, 1)
          : datePreset === "later"
            ? addDays(now, 2)
            : parseDateInput(dateValue)

    const [hours, minutes] = timeValue.split(":").map(Number)
    const due = combineDateAndSlot(
      day,
      draft.timeSlot,
      hours || 16,
      minutes || 0
    )
    const slotMeta = TIME_SLOTS.find((item) => item.id === draft.timeSlot)

    onSubmit({
      ...draft,
      customerName: name,
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      notes: draft.notes.trim(),
      dueAt: due.toISOString(),
      timeLabel:
        draft.timeSlot === "custom"
          ? timeValue
          : (slotMeta?.label ?? draft.timeLabel),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <Field label="Siapa yang pesan?" htmlFor="customerName">
        <Input
          id="customerName"
          value={draft.customerName}
          onChange={(event) =>
            setDraft((current) => ({ ...current, customerName: event.target.value }))
          }
          placeholder="Contoh: Bu Enah, Pak Dedi warung"
          className="h-12 rounded-2xl px-3 text-base"
          autoComplete="name"
        />
      </Field>

      <Field label="Nomor WhatsApp (opsional)" htmlFor="phone">
        <Input
          id="phone"
          value={draft.phone}
          onChange={(event) =>
            setDraft((current) => ({ ...current, phone: event.target.value }))
          }
          placeholder="08xxxxxxxxxx"
          inputMode="tel"
          className="h-12 rounded-2xl px-3 text-base"
        />
      </Field>

      <Field label="Pesan apa?">
        <ChoiceChips
          value={draft.productId}
          onChange={setProduct}
          options={PRODUCTS.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      </Field>

      <Field label="Berapa banyak?" htmlFor="quantity">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="size-12 rounded-2xl"
            onClick={() => bumpQty(-1)}
          >
            <MinusIcon />
          </Button>
          <Input
            id="quantity"
            type="number"
            min={0.5}
            step={0.5}
            value={draft.quantity}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                quantity: Number(event.target.value),
              }))
            }
            onFocus={(event) => event.currentTarget.select()}
            className="h-12 rounded-2xl text-center text-lg font-semibold"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="size-12 rounded-2xl"
            onClick={() => bumpQty(1)}
          >
            <PlusIcon />
          </Button>
        </div>
      </Field>

      <Field label="Satuan">
        <ChoiceChips
          columns={3}
          value={draft.unit}
          onChange={(unit) => setDraft((current) => ({ ...current, unit }))}
          options={UNITS.map((unit) => ({ value: unit, label: unit }))}
        />
      </Field>

      <Field label="Kapan diambil atau diantar?">
        <ChoiceChips
          value={datePreset}
          onChange={(preset) => {
            setDatePreset(preset)
            if (preset !== "custom") {
              const now = new Date()
              const day =
                preset === "today"
                  ? now
                  : preset === "tomorrow"
                    ? addDays(now, 1)
                    : addDays(now, 2)
              setDateValue(toDateInputValue(day))
            }
          }}
          options={[
            { value: "today", label: "Hari ini" },
            { value: "tomorrow", label: "Besok" },
            { value: "later", label: "Lusa" },
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
      </Field>

      <Field label="Jam berapa?">
        <ChoiceChips
          columns={2}
          value={draft.timeSlot}
          onChange={(slot: TimeSlot) =>
            setDraft((current) => ({ ...current, timeSlot: slot }))
          }
          options={[
            ...TIME_SLOTS.map((item) => ({
              value: item.id,
              label: item.label,
              hint: item.hint,
            })),
            { value: "custom" as const, label: "Jam tertentu", hint: "pilih jam" },
          ]}
        />
        {draft.timeSlot === "custom" ? (
          <Input
            type="time"
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
            className="mt-2 h-12 rounded-2xl px-3 text-base"
          />
        ) : null}
      </Field>

      <Field label="Ambil sendiri atau diantar?">
        <ChoiceChips
          value={draft.fulfillment}
          onChange={(fulfillment: Fulfillment) =>
            setDraft((current) => ({ ...current, fulfillment }))
          }
          options={[
            {
              value: "ambil",
              label: FULFILLMENT_META.ambil.label,
            },
            {
              value: "antar",
              label: FULFILLMENT_META.antar.label,
            },
          ]}
        />
      </Field>

      {draft.fulfillment === "antar" ? (
        <Field label="Diantar ke mana?" htmlFor="address">
          <Textarea
            id="address"
            value={draft.address}
            onChange={(event) =>
              setDraft((current) => ({ ...current, address: event.target.value }))
            }
            placeholder="Contoh: Pasar Greged, atau Blok Cibogo"
            className="min-h-20 rounded-2xl px-3 text-base"
          />
        </Field>
      ) : null}

      <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3">
        <Checkbox
          checked={draft.urgent}
          onCheckedChange={(checked) =>
            setDraft((current) => ({ ...current, urgent: Boolean(checked) }))
          }
          className="size-6 rounded-md"
        />
        <span>
          <span className="block text-sm font-semibold">Tandai penting</span>
          <span className="block text-xs text-muted-foreground">
            Pelanggan tetap, pesanan besar, atau yang harus didahulukan.
          </span>
        </span>
      </label>

      <Field label="Status bayar">
        <ChoiceChips
          columns={3}
          value={draft.payment}
          onChange={(payment: PaymentStatus) =>
            setDraft((current) => ({ ...current, payment }))
          }
          options={[
            { value: "belum", label: PAYMENT_META.belum.label },
            { value: "dp", label: PAYMENT_META.dp.label },
            { value: "lunas", label: PAYMENT_META.lunas.label },
          ]}
        />
      </Field>

      <Field label="Harga (opsional)" htmlFor="price">
        <Input
          id="price"
          type="number"
          min={0}
          inputMode="numeric"
          value={draft.price ?? ""}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              price: event.target.value === "" ? null : Number(event.target.value),
            }))
          }
          placeholder="Contoh: 30000"
          className="h-12 rounded-2xl px-3 text-base"
        />
      </Field>

      <Field label="Catatan" htmlFor="notes">
        <Textarea
          id="notes"
          value={draft.notes}
          onChange={(event) =>
            setDraft((current) => ({ ...current, notes: event.target.value }))
          }
          placeholder="Contoh: minta yang manis, titip ke anaknya..."
          className="min-h-24 rounded-2xl px-3 text-base"
        />
      </Field>

      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

      <Button type="submit" className="h-14 w-full rounded-2xl text-base font-semibold">
        {submitLabel}
      </Button>
    </form>
  )
}
