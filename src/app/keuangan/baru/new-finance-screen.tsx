"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/app-shell"
import { FinanceForm } from "@/components/finance/finance-form"
import { useFinance } from "@/hooks/use-finance"
import { FINANCE_KIND_META } from "@/lib/constants"
import type { FinanceKind } from "@/lib/types"

export function NewFinanceScreen({ kind }: { kind: FinanceKind }) {
  const router = useRouter()
  const { addEntry } = useFinance()

  return (
    <>
      <PageHeader
        title={FINANCE_KIND_META[kind].label}
        description="Isi jumlah dan untuk apa. Tanggal bisa diubah kalau bukan hari ini."
        backHref="/keuangan"
      />
      <div className="px-4 pt-5">
        <FinanceForm
          initialKind={kind}
          onSubmit={(draft) => {
            addEntry(draft)
            toast.success("Catatan uang sudah disimpan.")
            router.push("/keuangan")
          }}
        />
      </div>
    </>
  )
}
