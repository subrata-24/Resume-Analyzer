import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { generateUUID } from "~/lib/formatSize";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { AIResponseFormat } from "constants";
import { prepareInstructions } from "constants";

const upload = () => {
  const { auth, isLoading, fs, kv, ai } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadFile = await fs.upload([file]);
    if (!uploadFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Convert PDF to iamge...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadImage = await fs.upload([imageFile.file]);
    if (!uploadImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadFile.path,
      imagePath: uploadImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    const feedback = await ai.feedback(
      uploadFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat }),
    );
    if (!feedback) return setStatusText("Error: Failed to anaylyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/ats/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string; //"company-name is mainly the name of input field"
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className="min-h-screen bg-[url('images/bg-main.svg')] bg-cover flex flex-col">
      <Navbar />
      <section className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Smart feedback for your dream job
          </h1>
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <h2 className="text-xl font-semibold text-blue-700 animate-pulse">
                {statusText}
              </h2>
              <img
                src="images/resume-scan.gif"
                className="w-40 h-40 object-contain"
                alt="Processing..."
              />
            </div>
          ) : (
            <h2 className="text-lg text-center text-gray-600 mb-6">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              autoComplete="off"
            >
              <div className="form-div flex flex-col gap-1">
                <label
                  htmlFor="company-name"
                  className="font-medium text-gray-700"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="e.g. Google"
                  className="input input-bordered rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="form-div flex flex-col gap-1">
                <label
                  htmlFor="job-title"
                  className="font-medium text-gray-700"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="e.g. Software Engineer"
                  className="input input-bordered rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="form-div flex flex-col gap-1">
                <label
                  htmlFor="job-description"
                  className="font-medium text-gray-700"
                >
                  Job Description
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Paste the job description here..."
                  className="input input-bordered rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  required
                />
              </div>
              <div className="form-div flex flex-col gap-1">
                <label htmlFor="uploader" className="font-medium text-gray-700">
                  Resume PDF
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button
                className="primary-button bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 mt-2 transition-colors duration-200 shadow"
                type="submit"
                disabled={!file}
                aria-disabled={!file}
              >
                {file ? "Analyze Resume" : "Upload Resume to Analyze"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
