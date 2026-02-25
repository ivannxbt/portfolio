import { ImageResponse } from "next/og";
import { defaultContent } from "@/content/site-content";
import { locales, type Locale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = locales.includes(lang as Locale)
    ? (lang as Locale)
    : "es";
  const content = defaultContent[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
          }}
        />

        {/* Logo / site label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#6366f1",
              marginRight: "12px",
            }}
          />
          <span style={{ color: "#6366f1", fontSize: "18px", fontWeight: 600 }}>
            ivan-caamano.me
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          {content.branding.logoText}
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {content.hero.role}
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "96px",
            display: "flex",
            gap: "8px",
          }}
        >
          {["AI", "ML", "Cloud"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 16px",
                border: "1px solid #27272a",
                borderRadius: "9999px",
                color: "#52525b",
                fontSize: "14px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
