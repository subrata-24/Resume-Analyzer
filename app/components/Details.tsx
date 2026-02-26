import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ─── Accordion internals ─── */
interface AccCtx {
  active: string[];
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
}
const Ctx = createContext<AccCtx | undefined>(undefined);
const useAcc = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("Accordion context missing");
  return c;
};

const Accordion = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<string[]>([]);
  const toggle = (id: string) =>
    setActive((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const isOpen = (id: string) => active.includes(id);
  return (
    <Ctx.Provider value={{ active, toggle, isOpen }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </Ctx.Provider>
  );
};

const AccItem = ({
  id,
  title,
  score,
  children,
}: {
  id: string;
  title: string;
  score: number;
  children: ReactNode;
}) => {
  const { toggle, isOpen } = useAcc();
  const open = isOpen(id);
  const isGood = score >= 70;
  const isAvg = score >= 50;
  const color = isGood ? "#34d399" : isAvg ? "#fbbf24" : "#f87171";
  const bg = isGood
    ? "rgba(52,211,153,0.08)"
    : isAvg
      ? "rgba(251,191,36,0.08)"
      : "rgba(248,113,113,0.08)";
  const border = isGood
    ? "rgba(52,211,153,0.18)"
    : isAvg
      ? "rgba(251,191,36,0.18)"
      : "rgba(248,113,113,0.18)";
  const label = isGood ? "Strong" : isAvg ? "Average" : "Needs Work";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => toggle(id)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* mini score ring */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              background: bg,
              border: `1px solid ${border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color,
                fontSize: 13,
                fontWeight: 900,
                fontFamily: "monospace",
              }}
            >
              {score}
            </span>
          </div>
          <div>
            <p
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </p>
            <span
              style={{
                color,
                fontSize: 10,
                fontFamily: "monospace",
                opacity: 0.8,
              }}
            >
              {label.toUpperCase()}
            </span>
          </div>
        </div>
        <svg
          style={{
            width: 16,
            height: 16,
            color: "rgba(255,255,255,0.3)",
            flexShrink: 0,
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 2000 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─── Tip card ─── */
const TipCard = ({
  tip,
}: {
  tip: { type: "good" | "improve"; tip: string; explanation?: string };
}) => {
  const good = tip.type === "good";
  const color = good ? "#34d399" : "#fbbf24";
  const bg = good ? "rgba(52,211,153,0.05)" : "rgba(251,191,36,0.05)";
  const border = good ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: tip.explanation ? 8 : 0,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            flexShrink: 0,
            background: good
              ? "rgba(52,211,153,0.15)"
              : "rgba(251,191,36,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
            color,
          }}
        >
          {good ? "✓" : "!"}
        </div>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>
          {tip.tip}
        </p>
      </div>
      {tip.explanation && (
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
            margin: "0 0 0 32px",
            lineHeight: 1.65,
          }}
        >
          {tip.explanation}
        </p>
      )}
    </div>
  );
};

/* ─── Details ─── */
const Details = ({ feedback }: { feedback: Feedback }) => {
  const sections = [
    {
      id: "tone",
      title: "Tone & Style",
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      id: "content",
      title: "Content",
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 10,
          fontFamily: "monospace",
          letterSpacing: "0.12em",
          marginBottom: 4,
        }}
      >
        DETAILED BREAKDOWN
      </p>
      <Accordion>
        {sections.map((s) => (
          <AccItem key={s.id} id={s.id} title={s.title} score={s.score}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingTop: 14,
              }}
            >
              {s.tips.map((tip, i) => (
                <TipCard key={i} tip={tip as any} />
              ))}
            </div>
          </AccItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
