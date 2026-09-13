import type { MetadataRoute } from "next"
import { APP_NAME, APP_PLACE, APP_SHORT_NAME } from "@/lib/constants"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: `Catat dan prioritaskan pesanan usaha tape di ${APP_PLACE}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#F6F0E3",
    theme_color: "#8B5A2B",
    lang: "id",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
