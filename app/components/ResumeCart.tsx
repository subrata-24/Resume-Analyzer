import React from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCart = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`resume/${id}`}
      className="resume-card animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {/* Header section with text and score */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl text-black font-bold truncate">
            {companyName}
          </h2>
          <h3 className="text-md text-gray-500 truncate">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0 scale-90">
          {" "}
          {/* Slightly smaller circle */}
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* Small Resume Preview */}
      <div className="gradient-image-border">
        <img src={imagePath} alt={`${companyName} resume`} />
      </div>
    </Link>
  );
};

export default ResumeCart;
