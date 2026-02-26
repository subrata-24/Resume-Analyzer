import ScoreCircle from "./ScoreCircle";

const DemoResumeCart = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  const score = feedback?.overallScore ?? 0;
  const scoreColor =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : "text-rose-400";

  const scoreBg =
    score >= 80
      ? "bg-emerald-500/10 border-emerald-500/20"
      : score >= 60
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-rose-500/10 border-rose-500/20";

  const scoreLabel =
    score >= 80 ? "Strong" : score >= 60 ? "Average" : "Needs Work";

  return (
    <div className="group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(139,92,246,0.12)] hover:-translate-y-0.5">
      {/* Top section */}
      <div className="p-5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Company logo placeholder + name */}
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/70 shrink-0">
              {companyName?.[0]}
            </div>
            <h2 className="text-white font-bold text-[15px] truncate tracking-[-0.01em]">
              {companyName}
            </h2>
          </div>
          <p className="text-white/35 text-[12px] pl-9 truncate font-mono">
            {jobTitle}
          </p>
        </div>

        {/* Score badge */}
        <div
          className={`flex flex-col items-center shrink-0 px-3 py-1.5 rounded-xl border ${scoreBg}`}
        >
          <span className={`text-xl font-black leading-none ${scoreColor}`}>
            {score}
          </span>
          <span
            className={`text-[9px] font-mono tracking-wider mt-0.5 ${scoreColor} opacity-70`}
          >
            {scoreLabel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Resume image preview */}
      <div className="mx-5 mb-5 rounded-xl overflow-hidden border border-white/[0.06] relative">
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/60 via-transparent to-transparent z-10 pointer-events-none" />
        <img
          src={imagePath}
          alt={`${companyName} resume`}
          className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
        />

        {/* Demo pill */}
        <div className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-sm border border-white/10 text-white/50 text-[10px] font-mono tracking-widest px-2 py-1 rounded-md">
          DEMO
        </div>
      </div>

      {/* Mini score bars */}
      <div className="px-5 pb-5 space-y-2">
        {[
          { label: "ATS", score: feedback?.ATS?.score },
          { label: "Skills", score: feedback?.skills?.score },
          { label: "Content", score: feedback?.content?.score },
        ].map(({ label, score: s }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[10px] text-white/25 font-mono w-12 shrink-0 tracking-wider">
              {label}
            </span>
            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${s ?? 0}%` }}
              />
            </div>
            <span className="text-[10px] text-white/25 font-mono w-8 text-right">
              {s ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoResumeCart;
