"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  ListOrderedIcon,
  Settings2Icon,
} from "lucide-react"
import { SettingsSheet } from "@/components/settings-sheet"
import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Antrian", icon: ListOrderedIcon },
  { href: "/pesanan", label: "Semua", icon: ClipboardListIcon },
  { href: "/selesai", label: "Selesai", icon: CheckCircle2Icon },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome =
    pathname.startsWith("/pesanan/baru") ||
    pathname.includes("/edit") ||
    /^\/pesanan\/[^/]+$/.test(pathname)
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (hideChrome) {
    return <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">{children}</div>
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
            Usaha tape
          </p>
          <h1 className="font-heading text-xl leading-none">{APP_NAME}</h1>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex size-11 items-center justify-center rounded-2xl border border-border bg-card"
          aria-label="Pengaturan"
        >
          <Settings2Icon className="size-5" />
        </button>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-lg border-t border-border/70 bg-background/95 px-3 py-2 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-2xl text-xs font-semibold",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="mb-0.5 size-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

export function PageHeader({
  title,
  description,
  backHref,
}: {
  title: string
  description?: string
  backHref: string
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md">
      <Link href={backHref} className="text-sm font-medium text-primary">
        Kembali
      </Link>
      <h1 className="font-heading mt-1 text-2xl">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </header>
  )
}
