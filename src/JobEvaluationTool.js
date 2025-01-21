import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftPane from "./components/LeftPane";
import RightPane from "./components/RightPane";
import Report from "./components/Report";

const JobEvaluationTool = ({ addToHistory, selectedHistory }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (selectedHistory) {
      setJobDescription(selectedHistory.description);
      setResults(selectedHistory.results);
    }
  }, [selectedHistory]);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      alert("Please provide a job description before submitting.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post("https://cbef-92-234-51-164.ngrok-free.app/evaluate", {
        job_description: jobDescription,
      });

      if (response.data.success) {
        setResults(response.data.results);
        addToHistory(jobDescription, response.data.results);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error while making the API request:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleReset = () => {
    setJobDescription("");
    setResults([]);
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const backToMain = () => {
    setShowReport(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Header Section */}
      {!showReport && (
        <header
          style={{
            width: "100%",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <img
            src="uob-logo-black.webp"
            alt="University of Bath Logo"
            style={{ width: "10rem", height: "auto" }}
          />
        </header>
      )}

      {/* Main Content Section */}
      {showReport ? (
        <Report data={results} backToMain={backToMain} />
      ) : (
        <div style={{ display: "flex", flex: 1 }}>
          <LeftPane
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
          />
          <RightPane results={results} generateReport={generateReport} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default JobEvaluationTool;
