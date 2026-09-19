import { ImageResponse } from "next/og";

export const alt =
  "The Guvnor Ace Foundation — building brighter futures for children and families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#ffffff",
        background: "linear-gradient(135deg, #06172e 0%, #0a2140 58%, #237a55 100%)",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            background: "#e8b11f",
            color: "#06172e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          GAF
        </div>
        <div style={{ fontSize: 30, fontWeight: 700 }}>
          The Guvnor Ace Foundation
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ color: "#e8b11f", fontSize: 24, letterSpacing: 4 }}>
          EMPOWERING CHILDREN · STRENGTHENING COMMUNITIES
        </div>
        <div style={{ maxWidth: 930, fontSize: 72, lineHeight: 1.05 }}>
          Building brighter futures for children and families.
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 27, opacity: 0.9 }}>
          Community-led support in Uganda
        </div>
      </div>
    </div>,
    size,
  );
}
