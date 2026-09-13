import { Badge } from "@/components/ui/badge"
import { STATUS_META } from "@/lib/constants"
import { dueBadgeLabel } from "@/lib/format"
import { remainingDebt } from "@/lib/payment"
import { getDueKind, isActiveOrder } from "@/lib/priority"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusClass: Record<OrderStatus, string> = {
  baru: "border-transparent bg-[oklch(0.93_0.04_75)] text-[oklch(0.42_0.1_50)]",
  diproses: "border-transparent bg-[oklch(0.93_0.04_230)] text-[oklch(0.38_0.08_240)]",
  siap: "border-transparent bg-[oklch(0.93_0.05_145)] text-[oklch(0.36_0.08_145)]",
  selesai: "border-transparent bg-muted text-muted-foreground",
  batal: "border-transparent bg-destructive/10 text-destructive",
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("h-6 px-2.5 text-[11px]", statusClass[status])}>
      {STATUS_META[status].short}
    </Badge>
  )
}

export function DueBadge({ order }: { order: Order }) {
  if (!isActiveOrder(order)) return null
  const kind = getDueKind(order)
  const className =
    kind === "overdue"
      ? "border-transparent bg-destructive/12 text-destructive"
      : kind === "today"
        ? "border-transparent bg-[oklch(0.93_0.06_75)] text-[oklch(0.42_0.12_50)]"
        : "border-border bg-background text-muted-foreground"

  return (
    <Badge className={cn("h-6 px-2.5 text-[11px]", className)}>
      {dueBadgeLabel(order)}
    </Badge>
  )
}

export function DebtBadge({ order }: { order: Order }) {
  if (remainingDebt(order) <= 0) return null
  return (
    <Badge className="h-6 border-transparent bg-[oklch(0.55_0.16_35)] px-2.5 text-[11px] text-white">
      Hutang
    </Badge>
  )
}
