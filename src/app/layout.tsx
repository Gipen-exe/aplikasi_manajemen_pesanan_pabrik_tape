import type { Metadata, Viewport } from "next"
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google"
import { AppShell } from "@/components/app-shell"
import { Providers } from "@/components/providers"
import { APP_NAME, APP_PLACE } from "@/lib/constants"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: `${APP_NAME} — Kelola Pesanan`,
  description: `Aplikasi pencatat pesanan usaha tape di ${APP_PLACE}. Bantu pemilik ingat siapa yang pesan dan mana yang perlu didahulukan.`,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#8B5A2B",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
