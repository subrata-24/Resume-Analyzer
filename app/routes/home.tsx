import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCart from "~/components/ResumeCart";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DemoResumeCart from "~/components/DemoResumeCart";
import { resume } from "constants";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeIQ — AI-Powered Resume Analyzer" },
    {
      name: "description",
      content:
        "Analyze your resume against any job description and get an ATS score instantly.",
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      if (!auth.isAuthenticated) {
        setResumes(resume);
      } else {
        setLoadingResume(true);
        const resumes = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResume = resumes
          .map((resume) => {
            if (!resume.value) return null;
            try {
              return JSON.parse(resume.value);
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        setResumes(parsedResume);
        setLoadingResume(false);
      }
    };
    loadResume();
  }, [auth.isAuthenticated]);

  const isEmpty =
    auth.isAuthenticated && !loadingResume && resumes?.length === 0;

  return (
    <main className="min-h-screen bg-[#050810] relative overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-violet-800/8 blur-[100px]" />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Navbar />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-24">
        {/* Hero heading */}
        <div className="text-center mb-12 space-y-5">
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                textShadow: "0 0 40px rgba(255,255,255,0.15)",
              }}
            >
              Track Applications.{" "}
            </span>
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Beat the ATS.
            </span>
          </h1>

          <p className="text-white/40 text-[25px] max-w-xl mx-auto leading-relaxed font-light pt-3">
            {isEmpty
              ? "Upload your first resume to get AI-powered feedback and a detailed ATS score."
              : "Review your submissions and check AI-powered feedback below."}
          </p>
        </div>

        {/* Stats bar — only for authenticated with resumes */}
        {auth.isAuthenticated && resumes.length > 0 && (
          <div className="flex items-center justify-center gap-8 mb-14">
            {[
              { label: "Resumes Analyzed", value: resumes.length },
              {
                label: "Avg ATS Score",
                value:
                  Math.round(
                    resumes.reduce(
                      (a, r) => a + (r.feedback?.overallScore || 0),
                      0,
                    ) / resumes.length,
                  ) + "%",
              },
              {
                label: "Best Score",
                value:
                  Math.max(
                    ...resumes.map((r) => r.feedback?.overallScore || 0),
                  ) + "%",
              },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white tracking-tight">
                  {value}
                </div>
                <div className="text-[11px] text-white/30 font-mono tracking-widest mt-0.5">
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loadingResume && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:0.6s]" />
            </div>
            <p className="text-white/30 text-sm font-mono tracking-widest animate-pulse">
              LOADING RESUMES...
            </p>
          </div>
        )}

        {/* Demo resumes (unauthenticated) */}
        {!auth.isAuthenticated && (
          <>
            {/* Demo banner */}
            <div className="mb-8 flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl px-5 py-3 max-w-2xl mx-auto">
              <svg
                className="w-4 h-4 text-amber-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-amber-300/80 text-[12px] font-medium">
                You're viewing demo data.{" "}
                <button
                  onClick={() => navigate("/auth?next=/")}
                  className="text-amber-300 underline underline-offset-2 hover:text-amber-200 transition-colors"
                >
                  Sign in
                </button>{" "}
                to analyze your own resume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume: Resume, i: number) => (
                <div
                  key={resume?.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <DemoResumeCart resume={resume} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Authenticated resumes */}
        {auth.isAuthenticated && resumes?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume: Resume, i: number) => (
              <div
                key={resume?.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <ResumeCart
                  resume={resume}
                  onDelete={(id) =>
                    setResumes((prev) => prev.filter((r) => r.id !== id))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
              <svg
                className="w-9 h-9 text-white/20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-white/70 font-semibold text-[16px]">
                No resumes yet
              </h3>
              <p className="text-white/25 text-sm max-w-xs">
                Upload your resume and a job description to get your first ATS
                score.
              </p>
            </div>
            <Link
              to="/upload-resume"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.35)] no-underline"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Analyze Your First Resume
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
