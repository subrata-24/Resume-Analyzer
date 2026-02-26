import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
        />
        {/* dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          margin: "0 16px",
          background: "rgba(13,21,38,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top rainbow stripe */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />

        <div style={{ padding: "44px 40px 40px" }}>
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(124,58,237,0.45)",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              R
            </div>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 8px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 14,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Log in to continue your job journey and
              <br />
              access your resume analysis.
            </p>
          </div>

          {/* Features list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {[
              { icon: "🎯", text: "AI-powered ATS scoring" },
              { icon: "📊", text: "Detailed resume breakdown" },
              { icon: "🚀", text: "Actionable improvement tips" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Auth button */}
          {isLoading ? (
            <button
              disabled
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.25)",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                cursor: "not-allowed",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderTopColor: "rgba(255,255,255,0.5)",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
              Signing you in...
            </button>
          ) : auth.isAuthenticated ? (
            <button
              onClick={() => auth.signOut()}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => auth.signIn()}
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 0 28px rgba(124,58,237,0.4)",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(124,58,237,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(124,58,237,0.4)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* shine sweep */}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  transform: "translateX(-100%)",
                  animation: "shine 2.5s ease-in-out infinite",
                }}
              />
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log In with Puter
            </button>
          )}

          {/* Footer note */}
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.12)",
              fontSize: 11,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            SECURED · PRIVATE · NO ADS
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes shine   { 0%{transform:translateX(-100%)} 60%,100%{transform:translateX(100%)} }
      `}</style>
    </main>
  );
};

export default Auth;
