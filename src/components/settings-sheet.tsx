"use client"

import { useRef } from "react"
import { toast } from "sonner"
import { DownloadIcon, RotateCcwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useOrders } from "@/hooks/use-orders"
import { APP_NAME, APP_PLACE } from "@/lib/constants"
import { exportOrdersPayload, parseImportedOrders } from "@/lib/storage"

export function SettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { orders, hasSampleData, clearSamples, resetWithSamples, replaceAll } =
    useOrders()
  const fileRef = useRef<HTMLInputElement>(null)

  const downloadBackup = () => {
    const blob = new Blob([exportOrdersPayload(orders)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cadangan-pesanan-dasiti-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Cadangan pesanan sudah diunduh.")
  }

  const onImport = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const imported = parseImportedOrders(text)
      replaceAll(imported)
      toast.success(`Berhasil memulihkan ${imported.length} pesanan.`)
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
            Catatan pesanan {APP_NAME} di {APP_PLACE}. Dipakai pemilik yang juga
            memproduksi. Data tersimpan di HP ini.
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
          {hasSampleData ? (
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-2xl text-base"
              onClick={() => {
                clearSamples()
                toast.success("Contoh pesanan sudah dihapus.")
                onOpenChange(false)
              }}
            >
              <Trash2Icon />
              Hapus contoh pesanan
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-2xl text-base"
              onClick={() => {
                resetWithSamples()
                toast.success("Contoh pesanan ditampilkan lagi.")
                onOpenChange(false)
              }}
            >
              <RotateCcwIcon />
              Tampilkan contoh pesanan
            </Button>
          )}
          <p className="pt-3 text-xs leading-relaxed text-muted-foreground">
            Versi awal ini belum butuh akun. Kalau HP diganti, pakai cadangkan
            data supaya pesanan tidak hilang.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
