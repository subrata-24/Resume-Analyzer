import React from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleUpload = () => {
    auth.isAuthenticated
      ? navigate("/upload-resume")
      : navigate("/auth/?next=/upload-resume");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Glass morphism bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group no-underline">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_24px_rgba(139,92,246,0.7)] transition-shadow duration-300">
            <span className="text-white font-black text-sm tracking-tight">
              R
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-[15px] tracking-[-0.02em]">
              ResumeIQ
            </span>
            <span className="text-[10px] text-violet-400 font-mono tracking-widest">
              AI-POWERED
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpload}
            className="relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]"
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
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
                d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Analyze Resume
          </button>

          {auth.isAuthenticated ? (
            <button
              onClick={() => auth.signOut()}
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-200"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth?next=/")}
              className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-200"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
