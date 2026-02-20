import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCart = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const imageBlob = await fs.read(imagePath);
        if (!imageBlob) {
          setLoading(false);
          return;
        }

        let imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [imagePath]);

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
          <ScoreCircle score={feedback?.overallScore} />
        </div>
      </div>

      {/* Small Resume Preview */}
      <div className="gradient-image-border">
        {loading ? (
          <div className="w-full aspect-video bg-gray-200 animate-pulse rounded" />
        ) : (
          <img src={imageUrl} alt={`${companyName} resume`} />
        )}
      </div>
    </Link>
  );
};

export default ResumeCart;
