import { NewFinanceScreen } from "./new-finance-screen"
import type { FinanceKind } from "@/lib/types"

function asKind(value: string | string[] | undefined): FinanceKind {
  return value === "keluar" ? "keluar" : "masuk"
}

export default async function NewFinancePage({
  searchParams,
}: {
  searchParams: Promise<{ jenis?: string | string[] }>
}) {
  const query = await searchParams
  return <NewFinanceScreen kind={asKind(query.jenis)} />
}
