import { NewOrderScreen } from "./new-order-screen"

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ dari?: string | string[] }>
}) {
  const query = await searchParams
  const fromId = typeof query.dari === "string" ? query.dari : undefined
  return <NewOrderScreen fromId={fromId} />
}
