import React, { useState } from "react";
import "./styles.css";
import { FaBriefcase, FaCalculator, FaBook } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import JobEvaluationTool from "./JobEvaluationTool";
import History from "./components/History";
import RulesAndGuidelines from "./RulesAndGuidelines";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const tools = [
    { name: "Job Evaluation Tool", path: "/job-evaluation-tool", icon: <FaBriefcase /> },
    { name: "Salary Predictor", path: "/salary-predictor", icon: <FaCalculator /> },
    { name: "Rules and Guidelines", path: "/rules-and-guidelines", icon: <FaBook /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const addToHistory = (description, results) => {
    const date = new Date().toLocaleDateString();
    setHistoryItems((prev) => [
      ...prev,
      { date, description, results },
    ]);
  };

  const handleHistoryItemClick = (item) => {
    setSelectedHistory(item);
  };

  const handleDeleteItem = (index) => {
    const newItems = historyItems.filter((_, idx) => idx !== index);
    setHistoryItems(newItems);
  };

  const handleRenameItem = (index, newName) => {
    const newItems = [...historyItems];
    newItems[index].description = newName;
    setHistoryItems(newItems);
  };

  return (
    <Router>
      <div className="page-container">
        <History
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          historyItems={historyItems}
          onHistoryItemClick={handleHistoryItemClick}
          onDeleteItem={handleDeleteItem}
          onRenameItem={handleRenameItem}
        />

        <div className="content-wrapper">
          <Routes>
            {/* Main Home Page */}
            <Route
              path="/"
              element={
                <div className="main-section">
                  <img
                    src="/uob-logo-black.webp"
                    alt="University of Bath Logo"
                    className="logo"
                  />
                  <h2 className="main-title">University of Bath Tools</h2>

                  <div className="tools-grid">
                    {tools.map((tool, idx) => (
                      <Link to={tool.path} key={idx} className="tool-btn">
                        {tool.icon}
                        <span>{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              }
            />
            {/* Job Evaluation Tool */}
            <Route
              path="/job-evaluation-tool"
              element={
                <JobEvaluationTool
                  addToHistory={addToHistory}
                  selectedHistory={selectedHistory}
                />
              }
            />
            {/* Rules and Guidelines */}
            <Route path="/rules-and-guidelines" element={<RulesAndGuidelines />} />
          </Routes>
          <footer className="app-footer">
            <p>© {new Date().getFullYear()} University of Bath. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;
