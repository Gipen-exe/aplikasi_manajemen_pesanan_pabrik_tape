"use client"

import { useMemo, useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { ChoiceChips } from "@/components/choice-chips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FULFILLMENT_META,
  PACKAGES,
  PAYMENT_META,
  SOURCE_META,
  TIME_SLOTS,
} from "@/lib/constants"
import {
  addDays,
  combineDateAndSlot,
  parseDateInput,
  startOfDay,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/dates"
import { formatRupiah, isValidWhatsapp } from "@/lib/format"
import { remainingDebt, settledAmount } from "@/lib/payment"
import type {
  Fulfillment,
  Order,
  OrderDraft,
  OrderSource,
  PaymentStatus,
  TimeSlot,
} from "@/lib/types"

type DatePreset = "today" | "tomorrow" | "later" | "custom"

function inferDatePreset(dueAt: string, now = new Date()): DatePreset {
  const due = startOfDay(new Date(dueAt))
  if (due.getTime() === startOfDay(now).getTime()) return "today"
  if (due.getTime() === startOfDay(addDays(now, 1)).getTime()) return "tomorrow"
  if (due.getTime() === startOfDay(addDays(now, 2)).getTime()) return "later"
  return "custom"
}

function withPackage(
  draft: OrderDraft,
  packageId: string,
  quantity = draft.quantity
): OrderDraft {
  const selected = PACKAGES.find((item) => item.id === packageId)
  const unitPrice =
    packageId === "custom"
      ? draft.packageId === "custom"
        ? draft.unitPrice
        : null
      : (selected?.price ?? null)
  const packageLabel =
    packageId === "custom"
      ? draft.packageId === "custom"
        ? draft.packageLabel
        : ""
      : (selected?.name ?? draft.packageLabel)

  return {
    ...draft,
    packageId,
    packageLabel,
    quantity,
    unitPrice,
    price: unitPrice == null ? null : unitPrice * quantity,
    paidAmount: settledAmount(
      draft.payment,
      unitPrice == null ? null : unitPrice * quantity,
      draft.paidAmount
    ),
  }
}

function emptyDraft(now = new Date()): {
  draft: OrderDraft
  datePreset: DatePreset
  dateValue: string
  timeValue: string
} {
  const due = combineDateAndSlot(now, "sore")
  const base: OrderDraft = {
    customerName: "",
    phone: "",
    source: "whatsapp",
    packageId: "ember-kecil",
    packageLabel: "Ember kecil",
    quantity: 1,
    unitPrice: 75_000,
    dueAt: due.toISOString(),
    timeSlot: "sore",
    timeLabel: "Sore",
    fulfillment: "ambil",
    address: "",
    notes: "",
    payment: "belum",
    price: 75_000,
    paidAmount: 0,
    status: "baru",
  }
  return {
    datePreset: "today",
    dateValue: toDateInputValue(now),
    timeValue: "16:00",
    draft: base,
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
      source: order.source,
      packageId: order.packageId,
      packageLabel: order.packageLabel,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      dueAt: order.dueAt,
      timeSlot: order.timeSlot,
      timeLabel: order.timeLabel,
      fulfillment: order.fulfillment,
      address: order.address,
      notes: order.notes,
      payment: order.payment,
      price: order.price,
      paidAmount: order.paidAmount,
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
  notice,
  submitLabel,
  onSubmit,
}: {
  initial?: Order
  notice?: string
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

  const bumpQty = (delta: number) => {
    setDraft((current) =>
      withPackage(current, current.packageId, Math.max(1, current.quantity + delta))
    )
  }

  const setPayment = (payment: PaymentStatus) => {
    setDraft((current) => ({
      ...current,
      payment,
      paidAmount: settledAmount(payment, current.price, current.paidAmount),
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const name = draft.customerName.trim()
    if (!name) {
      setError("Nama pemesan wajib diisi.")
      return
    }
    if (!isValidWhatsapp(draft.phone)) {
      setError("Nomor WhatsApp wajib diisi, minimal 10 angka.")
      return
    }
    if (!draft.quantity || draft.quantity <= 0) {
      setError("Jumlah pesanan belum diisi.")
      return
    }
    if (draft.packageId === "custom" && !draft.packageLabel.trim()) {
      setError("Tulis nama wadah custom-nya.")
      return
    }
    if (draft.fulfillment === "antar" && !draft.address.trim()) {
      setError("Isi alamat rumah untuk pengantaran.")
      return
    }
    if (draft.payment === "dp" && draft.paidAmount <= 0) {
      setError("Isi berapa yang sudah dibayar untuk DP.")
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
    const price = draft.price
    const payment =
      price != null && draft.paidAmount >= price && draft.paidAmount > 0
        ? "lunas"
        : draft.payment

    onSubmit({
      ...draft,
      customerName: name,
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      notes: draft.notes.trim(),
      packageLabel:
        draft.packageId === "custom"
          ? draft.packageLabel.trim()
          : draft.packageLabel,
      payment,
      paidAmount: settledAmount(payment, price, draft.paidAmount),
      dueAt: due.toISOString(),
      timeLabel:
        draft.timeSlot === "custom"
          ? timeValue
          : (slotMeta?.label ?? draft.timeLabel),
    })
  }

  const debt = remainingDebt(draft)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      {notice ? (
        <p className="rounded-2xl bg-secondary/80 px-4 py-3 text-sm leading-relaxed">
          {notice}
        </p>
      ) : null}

      <Field label="Siapa yang pesan?" htmlFor="customerName">
        <Input
          id="customerName"
          value={draft.customerName}
          onChange={(event) =>
            setDraft((current) => ({ ...current, customerName: event.target.value }))
          }
          placeholder="Contoh: Bu Enah, Pak Dedi"
          className="h-12 rounded-2xl px-3 text-base"
          autoComplete="name"
        />
      </Field>

      <Field label="Pesan dari mana?">
        <ChoiceChips
          value={draft.source}
          onChange={(source: OrderSource) =>
            setDraft((current) => ({ ...current, source }))
          }
          options={[
            { value: "whatsapp", label: SOURCE_META.whatsapp.label },
            { value: "datang", label: SOURCE_META.datang.label },
            { value: "titip", label: SOURCE_META.titip.label },
            { value: "lain", label: SOURCE_META.lain.label },
          ]}
        />
      </Field>

      <Field label="Nomor WhatsApp" htmlFor="phone">
        <Input
          id="phone"
          value={draft.phone}
          onChange={(event) =>
            setDraft((current) => ({ ...current, phone: event.target.value }))
          }
          placeholder="08xxxxxxxxxx"
          inputMode="tel"
          autoComplete="tel"
          required
          className="h-12 rounded-2xl px-3 text-base"
        />
      </Field>

      <Field label="Wadah apa?">
        <ChoiceChips
          value={draft.packageId}
          onChange={(packageId) =>
            setDraft((current) => withPackage(current, packageId))
          }
          options={PACKAGES.map((item) => ({
            value: item.id,
            label: item.name,
            hint: item.price == null ? "harga menyesuaikan" : formatRupiah(item.price),
          }))}
        />
      </Field>

      {draft.packageId === "custom" ? (
        <div className="grid gap-3">
          <Field label="Nama wadah custom" htmlFor="packageLabel">
            <Input
              id="packageLabel"
              value={draft.packageLabel}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  packageLabel: event.target.value,
                }))
              }
              placeholder="Contoh: stoples kaca, bakul"
              className="h-12 rounded-2xl px-3 text-base"
            />
          </Field>
          <Field label="Harga per wadah" htmlFor="unitPrice">
            <Input
              id="unitPrice"
              type="number"
              min={0}
              inputMode="numeric"
              value={draft.unitPrice ?? ""}
              onChange={(event) => {
                const unitPrice =
                  event.target.value === "" ? null : Number(event.target.value)
                setDraft((current) => {
                  const price =
                    unitPrice == null ? current.price : unitPrice * current.quantity
                  return {
                    ...current,
                    unitPrice,
                    price,
                    paidAmount: settledAmount(current.payment, price, current.paidAmount),
                  }
                })
              }}
              placeholder="Sesuaikan dengan wadahnya"
              onFocus={(event) => event.currentTarget.select()}
              className="h-12 rounded-2xl px-3 text-base"
            />
          </Field>
        </div>
      ) : null}

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
            min={1}
            step={1}
            value={draft.quantity}
            onChange={(event) => {
              const quantity = Math.max(1, Number(event.target.value) || 1)
              setDraft((current) => withPackage(current, current.packageId, quantity))
            }}
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

      <Field label="Total harga" htmlFor="price">
        <Input
          id="price"
          type="number"
          min={0}
          inputMode="numeric"
          value={draft.price ?? ""}
          onChange={(event) => {
            const price = event.target.value === "" ? null : Number(event.target.value)
            setDraft((current) => ({
              ...current,
              price,
              paidAmount: settledAmount(current.payment, price, current.paidAmount),
            }))
          }}
          placeholder="Otomatis dari wadah × jumlah"
          onFocus={(event) => event.currentTarget.select()}
          className="h-12 rounded-2xl px-3 text-base"
        />
        {draft.unitPrice != null && draft.quantity > 1 ? (
          <p className="text-xs text-muted-foreground">
            {draft.quantity} × {formatRupiah(draft.unitPrice)}
          </p>
        ) : null}
      </Field>

      <Field label="Status bayar">
        <ChoiceChips
          columns={3}
          value={draft.payment}
          onChange={setPayment}
          options={[
            { value: "belum", label: PAYMENT_META.belum.label },
            { value: "dp", label: PAYMENT_META.dp.label },
            { value: "lunas", label: PAYMENT_META.lunas.label },
          ]}
        />
      </Field>

      {draft.payment === "dp" ? (
        <Field label="DP yang sudah dibayar" htmlFor="paidAmount">
          <Input
            id="paidAmount"
            type="number"
            min={0}
            inputMode="numeric"
            value={draft.paidAmount || ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                paidAmount: Number(event.target.value) || 0,
              }))
            }
            placeholder="Contoh: 50000"
            onFocus={(event) => event.currentTarget.select()}
            className="h-12 rounded-2xl px-3 text-base"
          />
        </Field>
      ) : null}

      {debt > 0 ? (
        <p className="rounded-2xl bg-[oklch(0.95_0.03_35)] px-3 py-3 text-sm font-medium text-[oklch(0.42_0.12_30)]">
          Sisa hutang {formatRupiah(debt)}
        </p>
      ) : null}

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

      <Field label="Ambil sendiri atau diantar ke rumah?">
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
        <Field label="Alamat rumah" htmlFor="address">
          <Textarea
            id="address"
            value={draft.address}
            onChange={(event) =>
              setDraft((current) => ({ ...current, address: event.target.value }))
            }
            placeholder="Contoh: rumah Bu Enah, Blok Cibogo, dekat mushola"
            className="min-h-20 rounded-2xl px-3 text-base"
          />
        </Field>
      ) : null}

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
