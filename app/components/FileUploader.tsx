import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/formatSize";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile: File = acceptedFiles[0] || null;
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
  });

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect?.(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer bg-white/80 hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-400 ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
        tabIndex={0}
        aria-label="File uploader dropzone"
      >
        <input {...getInputProps()} />
        <div className="space-y-4 w-full flex flex-col items-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="icons/info.svg" alt="Upload" className="w-16 h-16" />
          </div>
          {file ? (
            <div
              className="uploader-selected-file flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="images/pdf.png" alt="PDF" className="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-base text-gray-800 font-semibold">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                className="ml-2 p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                type="button"
                aria-label="Remove file"
                onClick={handleRemove}
              >
                <img src="icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center w-full">
              <p className="text-base text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-sm text-gray-400 mt-1">PDF only (max 20 MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
