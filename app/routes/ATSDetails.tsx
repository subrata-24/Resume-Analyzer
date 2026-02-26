import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

const ATSDetails = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      setResumeUrl(
        URL.createObjectURL(
          new Blob([resumeBlob], { type: "application/pdf" }),
        ),
      );

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      setImageUrl(URL.createObjectURL(imageBlob));

      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  return (
    <main style={{ minHeight: "100vh", background: "#07090f", paddingTop: 0 }}>
      {/* ── Top nav ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7,9,15,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 28px",
          height: 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "rgba(255,255,255,0.55)",
            fontSize: 13,
            fontWeight: 500,
            transition: "color 0.2s",
          }}
          className="cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
          }
        >
          <svg
            style={{ width: 16, height: 16 }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </nav>

      {/* ── Two-column layout ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        {/* LEFT — sticky resume preview */}
        <aside
          style={{
            width: 420,
            flexShrink: 0,
            position: "sticky",
            top: 56,
            height: "calc(100vh - 56px)",
            background: "rgba(255,255,255,0.015)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          {imageUrl && resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.015)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 16px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)";
              }}
            >
              <img
                src={imageUrl}
                alt="Resume"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </a>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ position: "relative", width: 60, height: 60 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid rgba(139,92,246,0.15)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid transparent",
                    borderTopColor: "#7c3aed",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 8,
                    borderRadius: "50%",
                    border: "2px solid transparent",
                    borderTopColor: "#22d3ee",
                    animation: "spin 0.65s linear infinite reverse",
                  }}
                />
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontSize: 12,
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                }}
              >
                LOADING RESUME...
              </p>
            </div>
          )}
        </aside>

        {/* RIGHT — feedback, fills all remaining space */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            padding: "40px 48px",
          }}
        >
          {/* inner wrapper: max readable width, centered within the available space */}
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h1
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Resume Review
              </h1>
            </div>

            {feedback ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  animation: "fadeUp 0.5s ease forwards",
                }}
              >
                <Summary feedback={feedback} />
                <ATS
                  score={feedback?.ATS?.score || 0}
                  suggestions={feedback?.ATS?.tips || []}
                />
                <Details feedback={feedback} />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 80,
                }}
              >
                <div style={{ position: "relative", width: 64, height: 64 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid rgba(139,92,246,0.15)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: "#7c3aed",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 8,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: "#22d3ee",
                      animation: "spin 0.65s linear infinite reverse",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    🤖
                  </div>
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 13,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    animation: "pulseDot 1.5s ease-in-out infinite",
                  }}
                >
                  LOADING FEEDBACK...
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseDot{ 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
};

export default ATSDetails;
