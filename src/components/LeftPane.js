import React from "react";
import { FaUpload, FaCheckCircle, FaRedo } from "react-icons/fa";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

const LeftPane = ({ jobDescription, setJobDescription, handleSubmit, handleReset }) => {
  const handleDocxUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const { value } = await mammoth.extractRawText({ arrayBuffer: event.target.result });
      setJobDescription(value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePdfUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map((item) => item.str).join(" ");
      }
      setJobDescription(extractedText);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!file) {
      alert("No file selected. Please choose a valid file.");
      return;
    }

    if (fileExtension === "docx") {
      handleDocxUpload(file);
    } else if (fileExtension === "pdf") {
      handlePdfUpload(file);
    } else if (fileExtension === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => setJobDescription(e.target.result);
      reader.readAsText(file);
    } else {
      alert("Unsupported file format. Please upload a .docx, .pdf, or .txt file.");
    }
  };

  return (
    <div className="left-pane">
      <h2 style={{ color: "#003b73", marginBottom: "1rem" }}>Provide the Job Description</h2>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste or type the job description here..."
      ></textarea>

      <div className="actions">
        <label htmlFor="fileInput" className="upload-btn">
          <FaUpload style={{ marginRight: "8px" }} />
          Upload File
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".txt, .pdf, .doc, .docx"
          onChange={handleFileUpload}
        />

        <button className="primary-btn" onClick={handleSubmit}>
          <FaCheckCircle style={{ marginRight: "8px" }} />
          Ready
        </button>
        <button className="secondary-btn" onClick={handleReset}>
          <FaRedo style={{ marginRight: "8px" }} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default LeftPane;
