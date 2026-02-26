import ScoreCircle from "./ScoreCircle";

const DemoResumeCart = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  return (
    <div className="resume-card animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with text and score */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl text-black font-bold truncate">
            {companyName}
          </h2>
          <h3 className="text-md text-gray-500 truncate">{jobTitle}</h3>
        </div>
        <div className="shrink-0 scale-90">
          {" "}
          {/* Slightly smaller circle */}
          <ScoreCircle score={feedback?.overallScore} />
        </div>
      </div>

      {/* Small Resume Preview */}
      <div className="gradient-image-border w-full">
        <img
          src={imagePath}
          alt={`${companyName} resume`}
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
};

export default DemoResumeCart;
