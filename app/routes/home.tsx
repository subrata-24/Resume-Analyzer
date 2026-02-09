import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "~/components/Navbar";
import { resumes } from "constants";
import ResumeCart from "~/components/ResumeCart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading p-16">
        <h1>Track your applications and resume ratings</h1>
        <h2>Review your submissions and check AI-powered feedback</h2>
      </div>
      {resumes?.length > 0 && 
      <div className="resumes-section">
        {resumes.map((resume: Resume) => (
          <ResumeCart key={resume.id} resume={resume} />
        ))}
      </div>
    }
    </section>
  </main>;
}
