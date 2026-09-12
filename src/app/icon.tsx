import { ImageResponse } from "next/og"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8B5A2B",
          color: "#F6F0E3",
          fontSize: 220,
          fontWeight: 700,
          letterSpacing: -8,
        }}
      >
        T
      </div>
    ),
    size
  )
}
