export function LoadingScreen({ label = "Menyiapkan catatan pesanan..." }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="size-10 animate-pulse rounded-full bg-primary/20" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
