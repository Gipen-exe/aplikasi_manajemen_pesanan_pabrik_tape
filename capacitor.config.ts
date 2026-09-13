import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.pabriktape.pesanan",
  appName: "Pesanan Tape",
  webDir: "public",
  server: {
    url: "https://app-tape-manage.vercel.app",
    androidScheme: "https",
  },
}

export default config
