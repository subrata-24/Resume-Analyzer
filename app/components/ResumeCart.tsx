import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

// Score color helpers
const getScoreColor = (score: number) => {
  if (score >= 80)
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
      glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]",
      label: "Strong",
    };
  if (score >= 60)
    return {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.2)]",
      label: "Average",
    };
  return {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    glow: "shadow-[0_0_12px_rgba(251,113,133,0.2)]",
    label: "Needs Work",
  };
};

const MiniBar = ({ label, score }: { label: string; score: number }) => {
  const color =
    score >= 80
      ? "from-emerald-500 to-emerald-400"
      : score >= 60
        ? "from-amber-500 to-amber-400"
        : "from-rose-500 to-rose-400";
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] text-white/25 font-mono tracking-wider w-14 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
      <span className="text-[10px] text-white/30 font-mono w-6 text-right">
        {score ?? 0}
      </span>
    </div>
  );
};

const ResumeCart = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
  onDelete,
}: {
  resume: Resume;
  onDelete: (id: string) => void;
}) => {
  const { fs, kv } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const score = feedback?.overallScore ?? 0;
  const colors = getScoreColor(score);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    try {
      await kv.delete(`resume:${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Failed to delete:", err);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const imageBlob = await fs.read(imagePath);
        if (!imageBlob) return;
        setImageUrl(URL.createObjectURL(imageBlob));
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [imagePath]);

  return (
    <div
      className={`group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]`}
    >
      {/* Delete confirm overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-30 bg-[#050810]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-rose-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white/80 font-semibold text-sm">
              Delete this resume?
            </p>
            <p className="text-white/30 text-[11px] mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-1.5 text-[12px] font-medium text-white/50 hover:text-white/80 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-1.5 text-[12px] font-medium text-white bg-rose-500/80 hover:bg-rose-500 border border-rose-500/30 rounded-lg transition-all disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      )}

      <Link
        to={`ats/${id}`}
        className="block no-underline"
        onClick={(e) => showDeleteConfirm && e.preventDefault()}
      >
        {/* Card header */}
        <div className="p-5 pb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              {/* Company initial avatar */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/25 to-cyan-500/25 border border-white/10 flex items-center justify-center text-[11px] font-black text-white/60 shrink-0">
                {companyName?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-white font-bold text-[15px] truncate tracking-[-0.01em]">
                {companyName}
              </h2>
            </div>
            <p className="text-white/30 text-[11px] font-mono pl-9 truncate tracking-wide">
              {jobTitle}
            </p>
          </div>

          {/* Score pill */}
          <div
            className={`flex flex-col items-center shrink-0 min-w-[52px] px-3 py-1.5 rounded-xl border ${colors.bg} ${colors.border} ${colors.glow}`}
          >
            <span
              className={`text-xl font-black leading-none tracking-tight ${colors.text}`}
            >
              {score}
            </span>
            <span
              className={`text-[8px] font-mono tracking-widest mt-0.5 ${colors.text} opacity-60`}
            >
              {colors.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Resume preview image */}
        <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.06] relative bg-white/[0.02]">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/70 via-transparent to-transparent z-10 pointer-events-none" />

          {loading ? (
            <div className="w-full aspect-[3/4] bg-white/[0.03] animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`${companyName} resume`}
              className="w-full h-auto block group-hover:scale-[1.015] transition-transform duration-500"
            />
          ) : (
            <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-2">
              <svg
                className="w-8 h-8 text-white/15"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-white/15 text-[10px] font-mono">
                NO PREVIEW
              </span>
            </div>
          )}
        </div>

        {/* Sub-score bars */}
        <div className="px-4 pb-4 space-y-1.5">
          <MiniBar label="ATS" score={feedback?.ATS?.score} />
          <MiniBar label="Skills" score={feedback?.skills?.score} />
          <MiniBar label="Content" score={feedback?.content?.score} />
        </div>
      </Link>

      {/* Footer actions */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-white/[0.05] pt-3">
        <Link
          to={`ats/${id}`}
          className="flex items-center gap-1.5 text-[11px] font-medium text-violet-400 hover:text-violet-300 no-underline transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="flex items-center gap-1.5 text-[11px] font-medium text-white/20 hover:text-rose-400 transition-colors duration-200 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ResumeCart;
