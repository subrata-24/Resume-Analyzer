import React from "react";

const getColors = (score: number) => {
  if (score >= 70)
    return {
      text: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
      label: "Strong",
    };
  if (score >= 50)
    return {
      text: "#fbbf24",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.2)",
      label: "Average",
    };
  return {
    text: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    label: "Needs Work",
  };
};

const ScoreGauge = ({ score }: { score: number }) => {
  const c = getColors(score);
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div
      style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={9}
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={c.text}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{
            filter: `drop-shadow(0 0 8px ${c.text})`,
            transition: "stroke-dashoffset 1s ease",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
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
            color: "rgba(255,255,255,0.3)",
            fontSize: 10,
            fontFamily: "monospace",
          }}
        >
          /100
        </span>
      </div>
    </div>
  );
};

const CategoryRow = ({ title, score }: { title: string; score: number }) => {
  const c = getColors(score);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          flex: 1,
          color: "rgba(255,255,255,0.6)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {title}
      </span>
      {/* bar */}
      <div
        style={{
          width: 120,
          height: 4,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: c.text,
            borderRadius: 99,
            boxShadow: `0 0 6px ${c.text}`,
          }}
        />
      </div>
      <span
        style={{
          color: c.text,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "monospace",
          width: 32,
          textAlign: "right",
        }}
      >
        {score}
      </span>
      <span
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.text,
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 99,
          fontFamily: "monospace",
          letterSpacing: "0.04em",
        }}
      >
        {c.label}
      </span>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const overall = getColors(feedback?.overallScore);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "24px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <ScoreGauge score={feedback?.overallScore} />
        <div>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.12em",
              marginBottom: 6,
            }}
          >
            OVERALL SCORE
          </p>
          <h2
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 6px",
            }}
          >
            Your Resume Score
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: overall.bg,
              border: `1px solid ${overall.border}`,
              color: overall.text,
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 12px",
              borderRadius: 99,
              fontFamily: "monospace",
            }}
          >
            {overall.label.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Category rows */}
      <div style={{ padding: "4px 28px 16px" }}>
        <CategoryRow
          title="Tone & Style"
          score={feedback?.toneAndStyle?.score}
        />
        <CategoryRow title="Content" score={feedback?.content?.score} />
        <CategoryRow title="Structure" score={feedback?.structure?.score} />
        <CategoryRow title="Skills" score={feedback?.skills?.score} />
      </div>
    </div>
  );
};

export default Summary;
