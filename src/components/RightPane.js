import React from "react";

const RightPane = ({ results, generateReport, loading }) => {
  const scores = results.scores || {}; // Scores dictionary
  const totalScore = results.total_score || 0; // Total score
  const grade = results.grade || "N/A"; // Final grade (Pay Grade)

  return (
    <div className="right-pane">
      <h2 style={{ color: "#003b73", marginBottom: "1rem" }}>
        Evaluation Results
      </h2>

      {loading ? (
        // Show loading spinner and computing text
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div
            className="spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #003b73",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p style={{ fontSize: "1.2rem", color: "#003b73", fontWeight: "bold" }}>
            Computing...
          </p>
        </div>
      ) : Object.keys(scores).length === 0 ? (
        <p>No results to display yet. Submit a job description to begin.</p>
      ) : (
        <>
          <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#003b73", color: "white" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>
                    Function
                  </th>
                  <th style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scores).map(([functionName, score], index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f6f6f6" : "white",
                    }}
                  >
                    <td style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>
                      {functionName}
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "right", border: "1px solid #ddd" }}>
                      {score}
                    </td>
                  </tr>
                ))}
                {/* Add Total Score Row */}
                <tr style={{ backgroundColor: "#003b73", color: "white" }}>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    Total Score
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      border: "1px solid #ddd",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {totalScore}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Final Grade Section */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#003b73",
              borderRadius: "8px",
              textAlign: "center",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Final Grade: {grade}
          </div>

          {/* Report Generation Button */}
          <button
            onClick={generateReport}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Generate Report
          </button>
        </>
      )}
    </div>
  );
};

export default RightPane;
