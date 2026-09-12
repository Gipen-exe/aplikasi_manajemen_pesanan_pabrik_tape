import { ClipboardListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string
  description: string
  actionLabel?: string
  href?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <ClipboardListIcon className="size-6" />
      </div>
      <h2 className="font-heading mt-4 text-xl">{title}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && href ? (
        <Button
          className="mt-5 h-11 px-5 text-base"
          nativeButton={false}
          render={<Link href={href} />}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
