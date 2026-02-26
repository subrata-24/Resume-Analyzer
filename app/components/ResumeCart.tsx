import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

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

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await kv.delete(`resume:${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Delete failed, try again");
    }
  };

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
    <div className="resume-card group relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to={`ats/${id}`} className="block">
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
        <div className="gradient-image-border">
          {loading ? (
            <div className="w-full aspect-video bg-gray-200 animate-pulse rounded" />
          ) : (
            <img src={imageUrl} alt={`${companyName} resume`} />
          )}
        </div>
      </Link>
      <button onClick={handleDelete} className="font-bold cursor-pointer">
        Delete
      </button>
    </div>
  );
};

export default ResumeCart;
