"use client"

import { useRef } from "react"
import { toast } from "sonner"
import { DownloadIcon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFinance } from "@/hooks/use-finance"
import { useOrders } from "@/hooks/use-orders"
import { APP_NAME, APP_PLACE } from "@/lib/constants"
import { exportBackupPayload, parseImportedBackup } from "@/lib/storage"

export function SettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { orders, replaceAll } = useOrders()
  const { entries: finance, replaceAll: replaceFinance } = useFinance()
  const fileRef = useRef<HTMLInputElement>(null)

  const downloadBackup = () => {
    const blob = new Blob([exportBackupPayload(orders, finance)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cadangan-pesanan-pabrik-tape-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Cadangan pesanan dan uang sudah diunduh.")
  }

  const onImport = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const imported = parseImportedBackup(text)
      replaceAll(imported.orders)
      if (imported.finance) replaceFinance(imported.finance)
      toast.success(`Berhasil memulihkan ${imported.orders.length} pesanan.`)
      onOpenChange(false)
    } catch {
      toast.error("Berkas cadangan tidak bisa dibaca.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">{APP_NAME}</SheetTitle>
          <SheetDescription>
            Pencatat pesanan pabrik tape di {APP_PLACE}. Data tersimpan di HP
            ini, tanpa akun.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-2 px-4 pb-6">
          <Button
            variant="outline"
            className="h-12 w-full justify-start rounded-2xl text-base"
            onClick={downloadBackup}
          >
            <DownloadIcon />
            Cadangkan data
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full justify-start rounded-2xl text-base"
            onClick={() => fileRef.current?.click()}
          >
            <UploadIcon />
            Pulihkan dari cadangan
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              void onImport(event.target.files?.[0])
              event.target.value = ""
            }}
          />
          <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
            Data tersimpan di HP ini. Kalau HP diganti, tekan Cadangkan data
            dulu.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
