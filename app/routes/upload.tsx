import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { generateUUID } from "~/lib/formatSize";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { AIResponseFormat, prepareInstructions } from "constants";

const STEPS = [
  { key: "upload", label: "Uploading resume" },
  { key: "convert", label: "Converting to image" },
  { key: "prepare", label: "Preparing data" },
  { key: "analyze", label: "Analyzing with AI" },
  { key: "done", label: "Analysis complete" },
];

const StepIndicator = ({ currentStep }: { currentStep: string }) => {
  const idx = STEPS.findIndex((s) => s.key === currentStep);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div
            key={step.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: done ? 0.4 : active ? 1 : 0.15,
              transition: "opacity 0.4s",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 700,
                background: done
                  ? "rgba(52,211,153,0.15)"
                  : active
                    ? "rgba(139,92,246,0.2)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${done ? "rgba(52,211,153,0.35)" : active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: done
                  ? "#34d399"
                  : active
                    ? "#a78bfa"
                    : "rgba(255,255,255,0.2)",
                boxShadow: active ? "0 0 14px rgba(139,92,246,0.35)" : "none",
              }}
            >
              {done ? (
                <svg
                  style={{ width: 13, height: 13 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : active ? (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#a78bfa",
                    display: "inline-block",
                    animation: "pulseDot 1.5s ease-in-out infinite",
                  }}
                />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: active
                    ? "#fff"
                    : done
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.15)",
                  fontSize: 13,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {step.label}
              </p>
              {active && (
                <div
                  style={{
                    marginTop: 6,
                    height: 2,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "55%",
                      background: "linear-gradient(90deg,#7c3aed,#22d3ee)",
                      borderRadius: 99,
                      animation: "runBar 1.8s ease-in-out infinite",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Upload = () => {
  const { fs, kv, ai } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      setCurrentStep("upload");
      const uploadFile = await fs.upload([file]);
      if (!uploadFile) throw new Error("Failed to upload file");

      setCurrentStep("convert");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) throw new Error("Failed to convert PDF to image");
      const uploadImage = await fs.upload([imageFile.file]);
      if (!uploadImage) throw new Error("Failed to upload image");

      setCurrentStep("prepare");
      const uuid = generateUUID();
      const data: any = {
        id: uuid,
        resumePath: uploadFile.path,
        imagePath: uploadImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setCurrentStep("analyze");
      const feedback = await ai.feedback(
        uploadFile.path,
        prepareInstructions({ jobTitle, jobDescription, AIResponseFormat }),
      );
      if (!feedback) throw new Error("Failed to analyze resume");

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;
      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setCurrentStep("done");
      await new Promise((r) => setTimeout(r, 700));
      navigate(`/ats/${uuid}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const companyName = fd.get("company-name") as string;
    const jobTitle = fd.get("job-title") as string;
    const jobDescription = fd.get("job-description") as string;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  /* ─── shared styles ─── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0d1526",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── ambient blobs ── */}
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
            right: "-8%",
            width: 550,
            height: 550,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(109,40,217,0.20) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-8%",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          }}
        />
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

      <Navbar />

      <section
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          paddingTop: 120,
          paddingBottom: 80,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          {/* ── Hero ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            {/* headline — solid white, no gradient bleed */}
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: "0 0 12px",
                color: "#ffffff",
              }}
            >
              Smart feedback for your{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                dream job
              </span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: 14,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Upload your resume and paste the job description
              <br />
              for an instant AI-powered ATS score.
            </p>
          </div>

          {/* ── Card ── */}
          <div
            style={{
              background: "rgba(13,21,38,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* top rainbow stripe */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg,#7c3aed,#06b6d4,#7c3aed)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s linear infinite",
              }}
            />

            {/* ── Processing ── */}
            {isProcessing ? (
              <div
                style={{
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 28,
                }}
              >
                <div style={{ position: "relative", width: 70, height: 70 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid rgba(124,58,237,0.1)",
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
                      fontSize: 22,
                    }}
                  >
                    🤖
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      margin: "0 0 4px",
                    }}
                  >
                    Analyzing your resume…
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.28)",
                      fontSize: 12,
                      margin: 0,
                    }}
                  >
                    This usually takes 10–30 seconds
                  </p>
                </div>
                <StepIndicator currentStep={currentStep} />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
                autoComplete="off"
              >
                {/* error */}
                {errorMsg && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "rgba(244,63,94,0.08)",
                      border: "1px solid rgba(244,63,94,0.25)",
                      borderRadius: 12,
                      padding: "10px 14px",
                    }}
                  >
                    <svg
                      style={{
                        width: 15,
                        height: 15,
                        color: "#f87171",
                        flexShrink: 0,
                      }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p style={{ color: "#fca5a5", fontSize: 12, margin: 0 }}>
                      {errorMsg}
                    </p>
                  </div>
                )}

                {/* Company + Job Title row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label htmlFor="company-name" style={labelStyle}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company-name"
                      id="company-name"
                      placeholder="e.g. Google"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(139,92,246,0.6)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(124,58,237,0.12)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.10)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="job-title" style={labelStyle}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="job-title"
                      id="job-title"
                      placeholder="e.g. Software Engineer"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(139,92,246,0.6)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(124,58,237,0.12)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.10)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div style={{ width: "100%", display: "block" }}>
                  <label htmlFor="job-description" style={labelStyle}>
                    Job Description
                  </label>
                  <textarea
                    rows={5}
                    name="job-description"
                    id="job-description"
                    placeholder="Paste the full job description here…"
                    required
                    style={{
                      ...inputStyle,
                      display: "block",
                      width: "100%",
                      minWidth: 0,
                      resize: "none",
                      lineHeight: 1.6,
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(139,92,246,0.6)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.10)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* File upload */}
                <div style={{ width: "100%", boxSizing: "border-box" }}>
                  <label style={labelStyle}>Resume PDF</label>
                  <FileUploader onFileSelect={setFile} />
                  {file && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 10,
                        background: "rgba(52,211,153,0.07)",
                        border: "1px solid rgba(52,211,153,0.22)",
                        borderRadius: 10,
                        padding: "8px 12px",
                      }}
                    >
                      <svg
                        style={{
                          width: 14,
                          height: 14,
                          color: "#34d399",
                          flexShrink: 0,
                        }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        style={{
                          color: "rgba(52,211,153,0.85)",
                          fontSize: 11,
                          fontFamily: "monospace",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(255,255,255,0.2)",
                          padding: 0,
                          lineHeight: 0,
                        }}
                      >
                        <svg
                          style={{ width: 14, height: 14 }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!file}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 14,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: file ? "pointer" : "not-allowed",
                    background: file
                      ? "linear-gradient(135deg, #7c3aed 0%, #0e7490 100%)"
                      : "rgba(255,255,255,0.05)",
                    color: file ? "#fff" : "rgba(255,255,255,0.2)",
                    boxShadow: file ? "0 0 28px rgba(124,58,237,0.35)" : "none",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    if (file)
                      e.currentTarget.style.boxShadow =
                        "0 0 40px rgba(124,58,237,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    if (file)
                      e.currentTarget.style.boxShadow =
                        "0 0 28px rgba(124,58,237,0.35)";
                  }}
                >
                  {file ? (
                    <>
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
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      Analyze Resume
                    </>
                  ) : (
                    <>
                      <svg
                        style={{ width: 16, height: 16, opacity: 0.35 }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Upload a Resume First
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin     { to { transform: rotate(360deg) } }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes runBar   { 0%{transform:translateX(-200%)} 100%{transform:translateX(400%)} }

        /* Kill browser white autofill background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0d1526 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }
        /* placeholder colour */
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.22) !important;
        }
      `}</style>
    </main>
  );
};

export default Upload;
