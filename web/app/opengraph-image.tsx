import { ImageResponse } from "next/og";

export const alt =
  "QueryMend — AI-powered SQL code review";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090B",
          color: "#F4F4F5",
          padding: "72px 84px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <svg
            width="112"
            height="112"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="30"
              r="22"
              fill="none"
              stroke="#F4F4F5"
              strokeWidth="10"
            />

            <path
              d="M32 8A22 22 0 0 1 32 52"
              fill="none"
              stroke="#10B981"
              strokeWidth="10"
            />

            <path
              d="M36 36L51 51"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeLinecap="square"
            />
          </svg>

          <div
            style={{
              display: "flex",
              fontSize: "82px",
              fontWeight: 700,
              letterSpacing: "-4px",
            }}
          >
            <span>Query</span>
            <span style={{ color: "#10B981" }}>
              Mend
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              color: "#10B981",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "7px",
              textTransform: "uppercase",
            }}
          >
            AI-powered static SQL review
          </div>

          <div
            style={{
              fontSize: "54px",
              fontWeight: 650,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Review SQL. Mend what matters.
          </div>

          <div
            style={{
              color: "#A1A1AA",
              fontSize: "27px",
              lineHeight: 1.4,
            }}
          >
            Structured feedback on correctness,
            readability, maintainability, and
            potential performance risks.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#71717A",
            fontSize: "22px",
          }}
        >
          <span>Oracle-first · Multi-dialect</span>
          <span>querymend.com</span>
        </div>
      </div>
    ),
    size,
  );
}