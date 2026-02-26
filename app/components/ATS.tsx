import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const isGood = score > 69;
  const isAverage = score > 49;

  const scoreColor = isGood ? "#34d399" : isAverage ? "#fbbf24" : "#f87171";
  const scoreBg = isGood
    ? "rgba(52,211,153,0.08)"
    : isAverage
      ? "rgba(251,191,36,0.08)"
      : "rgba(248,113,113,0.08)";
  const scoreBorder = isGood
    ? "rgba(52,211,153,0.2)"
    : isAverage
      ? "rgba(251,191,36,0.2)"
      : "rgba(248,113,113,0.2)";
  const label = isGood
    ? "Great Match"
    : isAverage
      ? "Good Start"
      : "Needs Improvement";
  const desc = isGood
    ? "Your resume is well-optimized for ATS systems. Keep it up!"
    : isAverage
      ? "Your resume passes basic ATS checks but has room to improve."
      : "Your resume may be filtered out by ATS. Focus on the tips below.";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* big score pill */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            flexShrink: 0,
            background: scoreBg,
            border: `1px solid ${scoreBorder}`,
            boxShadow: `0 0 20px ${scoreColor}22`,
          }}
        >
          <span
            style={{
              color: scoreColor,
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {score}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: 9,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            ATS
          </span>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              ATS Score
            </h2>
            <span
              style={{
                background: scoreBg,
                border: `1px solid ${scoreBorder}`,
                color: scoreColor,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 99,
                fontFamily: "monospace",
              }}
            >
              {label.toUpperCase()}
            </span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {desc}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div
        style={{
          padding: "16px 28px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 10,
            fontFamily: "monospace",
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}
        >
          SUGGESTIONS
        </p>
        {suggestions.map((s, i) => {
          const good = s.type === "good";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background: good
                  ? "rgba(52,211,153,0.05)"
                  : "rgba(251,191,36,0.05)",
                border: `1px solid ${good ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)"}`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  flexShrink: 0,
                  marginTop: 1,
                  background: good
                    ? "rgba(52,211,153,0.15)"
                    : "rgba(251,191,36,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 900,
                  color: good ? "#34d399" : "#fbbf24",
                }}
              >
                {good ? "✓" : "!"}
              </div>
              <p
                style={{
                  color: good
                    ? "rgba(52,211,153,0.85)"
                    : "rgba(251,191,36,0.85)",
                  fontSize: 13,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {s.tip}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ padding: "12px 28px 18px" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.18)",
            fontSize: 11,
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Keep refining your resume to improve your chances of getting past ATS
          filters and into the hands of recruiters.
        </p>
      </div>
    </div>
  );
};

export default ATS;
