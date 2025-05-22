import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          color: "white",
          textAlign: "center",
        }}
      >
        Test Image Working!
      </div>
    </div>,
    {
      width: 1080,
      height: 1920,
    },
  )
}
