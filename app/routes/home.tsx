import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "~/components/Navbar";
import ResumeCart from "~/components/ResumeCart";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DemoResumeCart from "~/components/DemoResumeCart";
import { resume } from "constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResume] = useState(false);

  // useEffect(() => {
  //   if (!auth.isAuthenticated) navigate("/auth?next=/");
  // }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      if (!auth.isAuthenticated) {
        setResumes(resume);
      } else {
        setLoadingResume(true);
        const resumes = (await kv.list("resume:*", true)) as KVItem[];

        const parsedResume = resumes?.map((resume) => JSON.parse(resume.value));

        setResumes(parsedResume);
        setLoadingResume(false);
      }
    };
    loadResume();
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track your applications and resume ratings</h1>

          {auth.isAuthenticated && !loadingResume && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {loadingResume && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-50" />
          </div>
        )}

        {!auth.isAuthenticated && (
          <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <DemoResumeCart key={resume?.id} resume={resume} />
            ))}
          </div>
        )}

        {auth.isAuthenticated && resumes?.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume: Resume) => (
              <ResumeCart
                key={resume?.id}
                resume={resume}
                onDelete={(id) => {
                  setResumes((prev) => prev.filter((r) => r.id !== id));
                }}
              />
            ))}
          </div>
        )}

        {auth.isAuthenticated && resumes.length == 0 && (
          <Link to={"/upload-resume"} className="primary-button w-fit">
            Analyze ATS
          </Link>
        )}
      </section>
    </main>
  );
}
